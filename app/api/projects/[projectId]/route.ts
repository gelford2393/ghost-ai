import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * Updates an existing project's details (e.g., name).
 * 
 * @param req - The incoming Next.js request object containing the updated fields.
 * @param context - An object containing the route parameters, including the projectId.
 * @param context.params - A promise that resolves to the route parameters.
 * @returns A JSON response containing the updated project, or an error status.
 */
export async function PATCH(
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

    const name =
      typeof body === 'object' && body !== null && 'name' in body
        ? (body as { name?: unknown }).name
        : undefined;

    if (typeof name !== 'string' || name.trim() === '') {
      return new NextResponse('Name is required', { status: 400 });
    }

    const result = await prisma.project.updateMany({
      where: {
        id: projectId,
        ownerId: userId,
      },
      data: {
        name: name.trim(),
      },
    });

    if (result.count === 0) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return new NextResponse('Not Found', { status: 404 });
      }

      return new NextResponse('Forbidden', { status: 403 });
    }

    const updatedProject = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!updatedProject) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('[PROJECT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * Deletes a specific project owned by the authenticated user.
 * 
 * @param req - The incoming Next.js request object.
 * @param context - An object containing the route parameters, including the projectId.
 * @param context.params - A promise that resolves to the route parameters.
 * @returns A JSON response confirming deletion with the projectId, or an error status.
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

    const result = await prisma.project.deleteMany({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (result.count === 0) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return new NextResponse('Not Found', { status: 404 });
      }

      return new NextResponse('Forbidden', { status: 403 });
    }

    return NextResponse.json({ id: projectId });
  } catch (error) {
    console.error('[PROJECT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
