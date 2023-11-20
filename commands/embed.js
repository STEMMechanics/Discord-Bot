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
        const embedData = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        if ('name' in embedData) {
          const { name } = path.parse(file);
          choices.push({ name: embedData.name, value: name });
        }
      } catch (error) {
        /* nothing */
      }
    });
  } catch (error) {
    /* nothing */
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

      await interaction.deferReply({ ephemeral: true }); // Acknowledge the command privately

      try {
        await interaction.deleteReply();
      } catch (error) {
        /* nothing */
      }

      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor({
          name: 'Some name',
          iconURL: 'https://i.imgur.com/AfFp7pu.png',
          url: 'https://discord.js.org',
        })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
          { name: 'Regular field title', value: 'Some value here' },
          { name: '\u200B', value: '\u200B' },
          { name: 'Inline field title', value: 'Some value here', inline: true },
          { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addFields({
          name: 'Inline field title',
          value: 'Some value here',
          inline: true,
        })
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({
          text: `Some footer text here ${item}`,
          iconURL: 'https://i.imgur.com/AfFp7pu.png',
        });

      await interaction.channel.send({ embeds: [exampleEmbed] });
    },
  }],
};
