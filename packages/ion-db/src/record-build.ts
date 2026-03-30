import { prisma } from './client';
import { parseArgs } from 'util';

async function main() {
  const { values } = parseArgs({
    options: {
      status: { type: 'string' },
      duration: { type: 'string' },
      commit: { type: 'string' },
      logs: { type: 'string' },
    },
  });

  const { status, duration, commit, logs } = values;

  if (!status || !duration || !commit) {
    console.error('Missing required arguments: status, duration, commit');
    process.exit(1);
  }

  try {
    const build = await prisma.build.create({
      data: {
        status,
        duration: parseInt(duration),
        commitHash: commit,
        logs: logs || null,
      },
    });

    console.log(`Successfully recorded build: ${build.id}`);
  } catch (error) {
    console.error('Failed to record build metadata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
