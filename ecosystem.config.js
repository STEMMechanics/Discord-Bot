module.exports = {
  apps: [
    {
      name: 'stemmech-discordbot',
      script: 'index.js',
      time: true,
      instances: 1,
      autorestart: true,
      max_restarts: 50,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
  deploy: {
    production: {
      user: 'discordbot',
      host: [
        {
          host: 'vps.stemmechanics.com.au',
          port: '49152',
        },
      ],
      key: 'deploy.key',
      ref: 'origin/main',
      repo: 'https://github.com/STEMMechanics/Discord-Bot',
      path: '/opt/discordbot/',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production && pm2 save',
    },
  },
};
