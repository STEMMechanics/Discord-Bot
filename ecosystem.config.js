module.exports = {
    apps: [
        {
            name: 'drustcraft-discord',
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
            host: 'vps.stemmechanics.com.au',
            key: 'deploy.key',
            ref: 'origin/main',
            repo: 'https://github.com/STEMMechanics/Drustcraft-Discord',
            path: '~/discord-bot',
            'post-deploy':
                'npm install && pm2 reload ecosystem.config.js --env production && pm2 save',
        },
    },
}