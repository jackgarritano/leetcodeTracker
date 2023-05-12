const { SlashCommandBuilder } = require('discord.js');
const { initUser } = require('../utils/mongoose/dbOperations');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Saves your LeetCode username')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your leetCode username')
                .setRequired(true)),
	async execute(interaction) {
        const usertag = interaction.user.tag;
        const username = interaction.options.getString('username');
        console.log(`username: ${username}`);
        try{
            replyStr = await initUser(usertag, username);
            await interaction.reply(replyStr);
        }
        catch(e){
            await interaction.reply(`Username could not be saved: ${e}`);
        }
		
	},
};