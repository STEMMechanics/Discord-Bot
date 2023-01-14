const { uploadHost, uploadPort, uploadPath, uploadKey } = require('./config.json'); 
var http = require('http');
const { SlashCommandBuilder } = require('discord.js');
const { isPlural } = require('pluralize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upload')
        .setDescription('....')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Upload type')
            .setRequired(true)
            .addChoices(
                { name: 'Schematic', value: 'schematic' },
                { name: 'ImageMap', value: 'imagemap' },
                { name: 'HeightMap', value: 'heightmap' },
            ))
        .addAttachmentOption(option => option
            .setName('attach')
            .setDescription('Attachment File')
            .setRequired(true)),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const user = message.author
        const file = interaction.options.getAttachment('attach')
        const type = interaction.options.getAttachment('type')

        const typeData = {
            'schematic': {
                name: 'Schematic',
                extensions: ['.schematic', '.schem']
            },
            'imagemap': {
                name: 'ImageMap',
                message: 'The image will be uploaded to the Minecraft server in a few mins.\nTo access it, use the command `/imagemap place %s` in creative mode',
                extensions: ['.png']
            },
            'heightmap': {
                name: 'HeightMap',
                message: 'The schematic will be uploaded to the Minecraft server in a few mins.\nTo access it, use the command `/schematic load %s` in creative mode',
                extensions: ['.png']
            }
        }

        var valid = false;
        if (typeData.hasOwnProperty(type)) {
            typeData[type].extensions.foreach((fileExt) => {
                if(file.name.endsWith(fileExt)) {
                    valid = true;
                }
            });
        }

        if(valid) {
            await interaction.editReply('Uploading file...');
            var httpOptions = {
                host: uploadHost,
                port: uploadPort,
                headers: {
                    'Authorization': 'Bearer ' + uploadToken
                },
                method: 'POST',
                path: uploadPath + '?type=' + type + '&username=' + interaction.user.username + '&url=' + file.url,
            };

            http.request(httpOptions, async (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
                }

                if (error) {
                    await interaction.editReply('Oh, the server could not receive the file right now');
                    console.error(error.message);
                    // Consume response data to free up memory
                    res.resume();
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', async () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        await interaction.editReply(util.format(typeData[type].message, parsedData.filename));
                    } catch (e) {
                        await interaction.editReply('Oh, the server could not receive the file right now');
                        console.error(e.message);
                    }
                });
            }).on('error', async (e) => {
                await interaction.editReply('Oh, the server could not receive the file right now');
                console.error(`Got error: ${e.message}`);
            });
        } else {
            await interaction.editReply('Hey, that type of file is not the right type');
        }
    },
};
