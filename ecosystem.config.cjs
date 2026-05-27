const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from the root .env or apps/ion/.env
let envConfig = {};
if (fs.existsSync('./.env')) {
  envConfig = dotenv.parse(fs.readFileSync('./.env'));
} else if (fs.existsSync('./apps/ion/.env')) {
  envConfig = dotenv.parse(fs.readFileSync('./apps/ion/.env'));
}

module.exports = {
  apps: [
    {
      name: "ion-request-service",
      script: "node",
      args: "dist/index.js",
      cwd: "./apps/ion-request-service",
      env: {
        NODE_ENV: "production",
        ...envConfig
      }
    },
    {
      name: "ion-repo-service",
      script: "node",
      args: "dist/index.js",
      cwd: "./apps/ion-repo-service",
      env: {
        NODE_ENV: "production",
        ...envConfig
      }
    },
    {
      name: "ion-websocket",
      script: "bun",
      args: "run index.ts",
      cwd: "./apps/ion-websocket",
      env: {
        NODE_ENV: "production",
        ...envConfig
      }
    },
    {
      name: "ion-deployment-service",
      script: "node",
      args: "dist/index.js",
      cwd: "./apps/ion-deployment-service",
      env: {
        NODE_ENV: "production",
        ...envConfig
      }
    }
  ]
};
