module.exports = {
  timers: [{
    delay: 10,
    execute(client) {
      const activities = [{
        type: 'PLAYING',
        text: 'with fire',
      }, {
        type: 'PLAYING',
        text: 'with Stop Motion',
      }, {
        type: 'PLAYING',
        text: 'with Green Screens',
      }, {
        type: 'PLAYING',
        text: 'Minecraft',
      },
      ];

      process.stdout.write('Update status\n');
      const activity = activities[Math.floor(Math.random() * activities.length)];
      process.stdout.write(`${activity.text}\n`);
      client.user.setActivity(activity.text, { type: activity.type });
    },
  }],
};
