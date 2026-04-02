import 'dotenv/config';
import { prisma } from "./client";

(async () => {
  try {
    const user = await prisma.user.upsert({
      where: { email: "tim@apple.com" },
      update: {
        name: "Tim Apple",
      },
      create: {
        id: "tim-apple-id",
        name: "Tim Apple",
        email: "tim@apple.com",
      }
    });

    await prisma.project.upsert({
      where: { projectId: "ion" },
      update: {
        repoUrl: "https://github.com/Tejas-pr/Ion",
      },
      create: {
        projectId: "ion",
        name: "Ion",
        repoUrl: "https://github.com/Tejas-pr/Ion",
        userId: user.id,
      }
    });
    
    console.log("Seeded user and 'ion' project.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
