/*
  https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityType#Playing

  Types:
  Competing - 5
  Custom - 4 (not available for bots?)
  Listening - 2
  Playing - 0
  Streaming - 1
  Watching - 3
*/

module.exports = {
  timers: [{
    delay: 30,
    execute(client) {
      const activities = [{
        type: 0,
        text: 'with fire',
      }, {
        type: 0,
        text: 'with Stop Motion',
      }, {
        type: 0,
        text: 'with Green Screens',
      }, {
        type: 0,
        text: 'Minecraft',
      },
      ];

      const activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setPresence({ activities: [{ name: activity.text, type: activity.type }], status: 'online' });
    },
  }],
};
