const { addToRoleOnJoin } = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(guildMember) {
        if (addToRoleOnJoin != undefined && addToRoleOnJoin.length > 0) {
            try {
                guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name === addToRoleOnJoin));
                console.log(`added user ${guildMember.user.username} to group ${addToRoleOnJoin}`);
            } catch (error) {
                console.error(`Error executing adding join role to user`);
                console.error(error);
            }
        }
    },
};
