module.exports = {
  timers: [{
    delay: 10,
    execute(client) {
      const activities = [{
        type: 'Playing',
        text: 'with fire',
      }, {
        type: 'Playing',
        text: 'with Stop Motion',
      }, {
        type: 'Playing',
        text: 'with Green Screens',
      }, {
        type: 'Playing',
        text: 'Minecraft',
      },
      ];

      const activity = activities[Math.floor(Math.random() * activities.length)];
      process.stdout.write(`Name: ${activity.text} Type: ${activity.type}\n`);
      // Set the client user's presence
      client.user.setPresence({ activities: [{ name: activity.text, type: activity.type }], status: 'online' });
      // client.user.setPresence({ activity: { name: activity.text, type: activity.type },
      // status: 'online' });
      // client.user.setActivity(activity.text, { type: activity.type });
    },
  }],
};
