const fs = require('node:fs');
const path = require('node:path');
const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

function calculateChoices() {
  const choices = [];
  const dirPath = path.join(__dirname, '../embeds');
  try {
    const files = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith('.json'));

    files.forEach(async (file) => {
      const filePath = path.join(dirPath, file);

      try {
        const embedData = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
        if ('name' in embedData) {
          const { name } = path.parse(file);
          choices.push({ name: embedData.name, value: name });
          process.stdout.write(`added embed ${file} with value ${name}: ${embedData.name}\n`);
        } else {
          process.stdout.write(`skipping embed ${file}\n`);
        }
      } catch (error) {
        process.stderr.write(`${error}\n`);
      }
    });
  } catch (error) {
    process.stderr.write(`${error}\n`);
  }

  return choices;
}

module.exports = {
  commands: [{
    data: new SlashCommandBuilder()
      .setName('embed')
      .setDescription('Embeds text')
      .addStringOption((option) => option
        .setName('item')
        .setDescription('The item to embed')
        .setRequired(true)
        .addChoices(...calculateChoices()))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
      const item = interaction.options.getString('item');

      const filePath = path.join(__dirname, `../embeds/${item}.json`);
      try {
        const embedData = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

        await interaction.deferReply({ ephemeral: true }); // Acknowledge the command privately
        try {
          await interaction.deleteReply();
        } catch (error) {
          process.stderr.write(`${error}\n`);
        }

        const embedItem = new EmbedBuilder();

        if ('color' in embedData) embedItem.setColor(parseInt(embedData.color.replace('0x', ''), 16));
        if ('title' in embedData) embedItem.setTitle(embedData.title);
        if ('url' in embedData) embedItem.setURL(embedData.url);
        if ('description' in embedData) embedItem.setDescription(embedData.description);

        await interaction.channel.send({ embeds: [embedItem] });
      } catch (error) {
        process.stderr.write(`${error}\n`);
        await interaction.reply(`The embed ${item} was not found or is invalid`);
      }
    },
  }],
};
