import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * Retrieves a list of projects owned by the authenticated user.
 * 
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing the user's projects ordered by creation date, or an error status.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('[PROJECTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * Creates a new project for the authenticated user.
 * 
 * @param req - The incoming Next.js request object containing the project details (e.g., name).
 * @returns A JSON response containing the newly created project, or an error status.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rawBody = await req.text();
    let body: unknown = {};

    if (rawBody.trim() !== '') {
      try {
        body = JSON.parse(rawBody);
      } catch {
        return new NextResponse('Invalid JSON', { status: 400 });
      }
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return new NextResponse('Invalid request body', { status: 400 });
    }

    const name = 'name' in body ? (body as { name?: unknown }).name : undefined;

    if (name !== undefined && typeof name !== 'string') {
      return new NextResponse("Invalid 'name' type", { status: 400 });
    }

    const projectName = name && name.trim() !== '' ? name.trim() : 'Untitled Project';

    const project = await prisma.project.create({
      data: {
        ownerId: userId,
        name: projectName,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('[PROJECTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
