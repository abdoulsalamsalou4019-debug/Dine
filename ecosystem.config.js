module.exports = {
  apps: [
    {
      name: 'dine',
      script: 'server.js',
      env: {
        NODE_ENV: 'development',
        ADMIN_KEY: 'Amsardine229',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        ADMIN_KEY: 'Amsardine229',
        PORT: 3000
      }
    }
  ]
};
