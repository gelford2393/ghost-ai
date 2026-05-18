import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';

type ProjectWithCollaborators = Prisma.ProjectGetPayload<{
  include: { collaborators: true };
}>;

interface ClerkUserSummary {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
}

/**
 * Retrieves the collaborator list for a specific project, enriched with Clerk user profiles.
 * Includes the project owner for prominence in UI lists.
 * 
 * @param req - The incoming Next.js request.
 * @param context - The dynamic route parameters.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!projectId) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    // Fetch the project and its collaborators
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        collaborators: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!project) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Cast to type-safe ProjectWithCollaborators to access relations safely
    const projectWithRelations = project as ProjectWithCollaborators;

    // Verify permission: User must be either the owner or a collaborator
    const isOwner = projectWithRelations.ownerId === userId;
    const userEmails = user.emailAddresses
      .map((e) => e.emailAddress?.toLowerCase())
      .filter((email): email is string => !!email);

    if (userEmails.length === 0) {
      return new NextResponse('User email not found', { status: 400 });
    }

    const isCollaborator = projectWithRelations.collaborators.some((c) =>
      userEmails.includes(c.email.toLowerCase())
    );

    if (!isOwner && !isCollaborator) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const clerk = await clerkClient();

    // 1. Fetch Owner details from Clerk
    let ownerDetails = {
      id: 'owner',
      email: '',
      name: 'Owner',
      imageUrl: null as string | null,
      role: 'owner' as const,
    };

    try {
      const ownerClerkUser = await clerk.users.getUser(projectWithRelations.ownerId);
      ownerDetails = {
        id: 'owner',
        email:
          ownerClerkUser.emailAddresses.find((e) => e.id === ownerClerkUser.primaryEmailAddressId)
            ?.emailAddress ??
          ownerClerkUser.emailAddresses[0]?.emailAddress ??
          '',
        name:
          ownerClerkUser.fullName ||
          `${ownerClerkUser.firstName ?? ''} ${ownerClerkUser.lastName ?? ''}`.trim() ||
          'Project Owner',
        imageUrl: ownerClerkUser.imageUrl || null,
        role: 'owner' as const,
      };
    } catch (err) {
      console.error('[COLLABORATORS_GET_OWNER_CLERK]', err);
    }

    // 2. Fetch Collaborators' details from Clerk and enrich
    const collaboratorEmails = projectWithRelations.collaborators.map((c) => c.email);
    let clerkUsers: ClerkUserSummary[] = [];

    if (collaboratorEmails.length > 0) {
      try {
        const response = await clerk.users.getUserList({
          emailAddress: collaboratorEmails,
        });
        clerkUsers = response.data;
      } catch (err) {
        console.error('[COLLABORATORS_GET_CLERK_USERS]', err);
      }
    }

    const enrichedCollaborators = projectWithRelations.collaborators.map((c) => {
      const clerkUser = clerkUsers.find((u) =>
        u.emailAddresses.some((e) => e.emailAddress.toLowerCase() === c.email.toLowerCase())
      );

      return {
        id: c.id,
        email: c.email,
        name: clerkUser
          ? clerkUser.fullName ||
          `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() ||
          null
          : null,
        imageUrl: clerkUser?.imageUrl || null,
        role: 'collaborator' as const,
      };
    });

    return NextResponse.json({
      owner: ownerDetails,
      collaborators: enrichedCollaborators,
    });
  } catch (error) {
    console.error('[COLLABORATORS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * Invites a new collaborator by adding their email to the project.
 * Enforces ownership server-side.
 * 
 * @param req - The incoming Next.js request.
 * @param context - The dynamic route parameters.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!projectId) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new NextResponse('Invalid JSON', { status: 400 });
    }

    const email = typeof body === 'object' && body !== null && 'email' in body
      ? (body as { email?: unknown }).email
      : undefined;

    if (typeof email !== 'string' || email.trim() === '') {
      return new NextResponse('Email is required', { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return new NextResponse('Invalid email address', { status: 400 });
    }

    // Verify project exists and user is owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Restore critical security ownership check
    if (project.ownerId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Prevent inviting the project owner as a collaborator
    const clerk = await clerkClient();
    let ownerEmail = '';
    try {
      const ownerClerkUser = await clerk.users.getUser(project.ownerId);
      ownerEmail = (
        ownerClerkUser.emailAddresses.find((e) => e.id === ownerClerkUser.primaryEmailAddressId)
          ?.emailAddress ??
        ownerClerkUser.emailAddresses[0]?.emailAddress ??
        ''
      ).toLowerCase();
    } catch (err) {
      console.error('[COLLABORATORS_POST_OWNER_CLERK]', err);
      // Fail-safe: Reject invite if we can't verify owner email
      return new NextResponse('Unable to verify project owner details', { status: 500 });
    }

    if (normalizedEmail === ownerEmail) {
      return new NextResponse('You cannot invite the project owner as a collaborator', { status: 400 });
    }

    // Check for duplicate collaborator
    const existing = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_email: {
          projectId,
          email: normalizedEmail,
        },
      },
    });

    if (existing) {
      return new NextResponse('Collaborator already exists', { status: 400 });
    }

    // Add collaborator
    const newCollaborator = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email: normalizedEmail,
      },
    });

    return NextResponse.json(newCollaborator);
  } catch (error) {
    console.error('[COLLABORATORS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * Removes a collaborator from the project.
 * Enforces ownership server-side.
 * 
 * @param req - The incoming Next.js request.
 * @param context - The dynamic route parameters.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!projectId) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const collaboratorId = searchParams.get('id');

    if (!collaboratorId) {
      return new NextResponse('Collaborator ID is required', { status: 400 });
    }

    // Verify project exists and user is owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (project.ownerId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Delete collaborator from database
    const result = await prisma.projectCollaborator.deleteMany({
      where: {
        id: collaboratorId,
        projectId,
      },
    });

    if (result.count === 0) {
      return new NextResponse('Collaborator not found', { status: 404 });
    }

    return NextResponse.json({ success: true, id: collaboratorId });
  } catch (error) {
    console.error('[COLLABORATORS_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
