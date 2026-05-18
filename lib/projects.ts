import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function getProjects() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { owned: [], shared: [] };
  }

  const userEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
    ?? user.emailAddresses[0]?.emailAddress;

  // Fetch owned projects
  const owned = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch shared projects (where the user is a collaborator)
  const shared = userEmail 
    ? await prisma.project.findMany({
        where: {
          collaborators: {
            some: {
              email: userEmail,
            },
          },
          // Exclude owned projects just in case
          NOT: {
            ownerId: userId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    : [];

  return {
    owned,
    shared,
  };
}
