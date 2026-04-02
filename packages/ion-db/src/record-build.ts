import { prisma } from './client';
import { parseArgs } from 'util';

async function main() {
  const { values } = parseArgs({
    options: {
      status: { type: 'string' },
      duration: { type: 'string' },
      commit: { type: 'string' },
      logs: { type: 'string' },
      project: { type: 'string' },
    },
  });

  const { status, duration, commit, logs, project: projectIdentifier } = values;

  if (!status || !duration || !commit || !projectIdentifier) {
    console.error('Missing required arguments: status, duration, commit, project');
    process.exit(1);
  }

  try {
    const project = await prisma.project.findUnique({
      where: { projectId: projectIdentifier },
    });

    if (!project) {
      console.error(`Project with projectId '${projectIdentifier}' not found.`);
      process.exit(1);
    }

    const build = await prisma.build.create({
      data: {
        status: status.toUpperCase(),
        duration: duration === 'null' ? null : parseInt(duration),
        commitHash: commit,
        logs: logs || null,
        projectId: project.id,
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
