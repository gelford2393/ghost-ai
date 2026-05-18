import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import type { Project } from '@/app/generated/prisma/client';

export type AccessStatus =
  | { authorized: false; reason: 'unauthenticated' | 'not-found' | 'forbidden' }
  | { authorized: true; project: Project; role: 'owner' | 'collaborator' };

export async function verifyProjectAccess(roomId: string): Promise<AccessStatus> {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { authorized: false, reason: 'unauthenticated' };
  }

  const project = await prisma.project.findUnique({
    where: { id: roomId },
    include: {
      collaborators: true,
    },
  });

  if (!project) {
    return { authorized: false, reason: 'not-found' };
  }

  if (project.ownerId === userId) {
    const { collaborators, ...projectWithoutRelations } = project;
    return { authorized: true, project: projectWithoutRelations, role: 'owner' };
  }

  const userEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
    ?? user.emailAddresses[0]?.emailAddress;
  const normalizedUserEmail = userEmail?.trim().toLowerCase();
  const isCollaborator =
    !!normalizedUserEmail &&
    project.collaborators.some(
      (c) => c.email.trim().toLowerCase() === normalizedUserEmail
    );

  if (isCollaborator) {
    const { collaborators, ...projectWithoutRelations } = project;
    return { authorized: true, project: projectWithoutRelations, role: 'collaborator' };
  }

  return { authorized: false, reason: 'forbidden' };
}
