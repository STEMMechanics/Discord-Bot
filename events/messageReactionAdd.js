module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction) {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
      // If the message this reaction belongs to was removed, the fetching might result in an API
      // error which should be handled
      try {
        await reaction.fetch();
      } catch (error) {
        // console.error('Something went wrong when fetching the message:', error);
        // Return as `reaction.message.author` may be undefined/null
      }
    }

    // Now the message has been cached and is fully available
    // The reaction is now also fully available and the properties will be reflected accurately:
    // console.log(`${reaction.count} user(s) have given the same reaction to this message!`);

    // Has the person reacted to participating to the challenge? - Add them to the Participants Role
  },
};
