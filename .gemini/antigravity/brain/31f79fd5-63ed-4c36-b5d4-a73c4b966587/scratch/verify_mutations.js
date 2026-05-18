
// Mock Prisma and NextResponse to test the logic flow
const prisma = {
  project: {
    updateMany: async ({ where, data }) => {
      // Simulation: Project 1 belongs to User A, Project 2 belongs to User B
      if (where.id === '1' && where.ownerId === 'A') return { count: 1 };
      if (where.id === '2' && where.ownerId === 'B') return { count: 1 };
      return { count: 0 };
    },
    deleteMany: async ({ where }) => {
      if (where.id === '1' && where.ownerId === 'A') return { count: 1 };
      if (where.id === '2' && where.ownerId === 'B') return { count: 1 };
      return { count: 0 };
    },
    findUnique: async ({ where }) => {
      if (where.id === '1') return { id: '1', ownerId: 'A', name: 'Project 1' };
      if (where.id === '2') return { id: '2', ownerId: 'B', name: 'Project 2' };
      return null;
    }
  }
};

class NextResponse {
  constructor(body, init) {
    this.body = body;
    this.status = init.status;
  }
  static json(data) {
    return { body: data, status: 200 };
  }
}

async function handlePatch(projectId, userId, name) {
  const result = await prisma.project.updateMany({
    where: { id: projectId, ownerId: userId },
    data: { name }
  });

  if (result.count === 0) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return new NextResponse('Not Found', { status: 404 });
    return new NextResponse('Forbidden', { status: 403 });
  }

  const updatedProject = await prisma.project.findUnique({ where: { id: projectId } });
  return NextResponse.json(updatedProject);
}

async function handleDelete(projectId, userId) {
  const result = await prisma.project.deleteMany({
    where: { id: projectId, ownerId: userId }
  });

  if (result.count === 0) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return new NextResponse('Not Found', { status: 404 });
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.json({ id: projectId });
}

async function runTests() {
  console.log('Testing PATCH:');
  console.log('1. Success (Owner A updates P1):', await handlePatch('1', 'A', 'New P1'));
  console.log('2. 403 (User B tries to update P1):', await handlePatch('1', 'B', 'New P1'));
  console.log('3. 404 (User A tries to update P3):', await handlePatch('3', 'A', 'New P3'));

  console.log('\nTesting DELETE:');
  console.log('1. Success (Owner A deletes P1):', await handleDelete('1', 'A'));
  console.log('2. 403 (User B tries to delete P1):', await handleDelete('1', 'B'));
  console.log('3. 404 (User A tries to delete P3):', await handleDelete('3', 'A'));
}

runTests();
