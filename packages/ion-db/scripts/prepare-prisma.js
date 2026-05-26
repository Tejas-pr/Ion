const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../node_modules/@prisma/client');
const sourceDir = path.join(__dirname, '../../../node_modules/@prisma/client');
const targetPrismaFolder = path.join(__dirname, '../node_modules/@prisma');

if (!fs.existsSync(targetDir) && fs.existsSync(sourceDir)) {
  console.log('Copying hoisted @prisma/client into local node_modules to fix Prisma resolution bug...');
  fs.mkdirSync(targetPrismaFolder, { recursive: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log('Successfully copied @prisma/client.');
} else if (fs.existsSync(targetDir)) {
  console.log('@prisma/client already exists locally. Proceeding to generate.');
} else {
  console.error('Could not find hoisted @prisma/client at ' + sourceDir);
}
