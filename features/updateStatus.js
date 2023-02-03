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

      const activity = activities[Math.floor(Math.random() * activities.length)];

      client.user.setActivity(activity.text, { type: activity.type });
    },
  }],
};
