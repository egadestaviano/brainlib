module.exports = {
  apps: [
    {
      name: "brainlib-frontend",
      script: ".output/server/index.mjs",
      exec_mode: "fork",
      env: {
        PORT: 8004,
        NODE_ENV: "production",
      },
    },
  ],
};
