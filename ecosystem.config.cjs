module.exports = {
  apps: [
    {
      name: "ion-request-service",
      script: "node",
      args: "dist/index.js",
      cwd: "./apps/ion-request-service",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "ion-repo-service",
      script: "node",
      args: "dist/index.js",
      cwd: "./apps/ion-repo-service",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "ion-websocket",
      script: "bun",
      args: "run index.ts",
      cwd: "./apps/ion-websocket",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "ion-deployment-service",
      script: "node",
      args: "dist/index.js",
      cwd: "./apps/ion-deployment-service",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
