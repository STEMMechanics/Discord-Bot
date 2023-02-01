const store = require("./../utils/store")
const { EmbedBuilder } = require("discord.js")
const { countingGameRulesChannelId } = require("discord.js")

function handleMessage(message) {
	let death = false
		
	if (message.author.id == store.get("last.user.game.one")) {
		toDelete = true
	} else if (message.author.id == store.get("last.user.game.two")) {
		toDelete = true
	}

	if (death) {
		// temp until we figure out resetting
		message.delete()
		store.set("last.user.game.two", "")
		store.set("last.user.game.one", "")
	} else {
		store.load()
		store.set("last.user.game.two", store.get("last.user.game.one"))
		store.set("last.user.game.one", message.author.id)
		store.save()
	}
}

function gameEmbed(highscore, date, slashCommand) {

	let dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

	let embed = new EmbedBuilder()
		.setColor("#80FFFF")
		.setTitle("Counting Chain Game")
		.setDescription("The goal is to get to the highest number we can!")
		.addFields([
			{
				"name": "Rule #1",
				"value": "The chain will be made up of GIFs. If there isn't a GIF for the number, you may use a picture."
			},
			{
				"name": "Rule #2",
				"value": "The next number must be 1 higher than the previous number."
			},
			{
				"name": "Rule #3",
				"value": "All GIFs / Pictures **must comply** with the rules the server already has. (See #rules)"
			},
			{
				"name": "Rule #4",
				"value": "In order to prevent a 1-player or 2-player game, you can only send your message **once** every 3 counts.\n(E.G. Player #1 -> Player #2 -> Player #3 -> Player #1)"
			},
			{
				"name": "When does the chain break?",
				"value": "Just when the rules laid above aren't followed, when the chain breaks, simply start the chain again."
			},
			{
				"name": "Additional information",
				"value": "Please don't reply to the previous number, to avoid pinging the user. If you have any questions. DM <@477976211436339220> or in <#827355095561535499>."
			},
			{
				"name": "And best of all...",
				"value": "Have fun!"
			},
			{
				"name": "Current Highscore",
				"value": `${highscore} (As of ${dateString}.) `
			}
		])

	slashCommand.guild.channels.cache[countingGameRulesChannelId].send({ embeds: [embed] })
}