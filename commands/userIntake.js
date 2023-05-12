const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Saves your LeetCode username'),
	async execute(interaction) {
		await interaction.reply('Response appeared');
	},
};