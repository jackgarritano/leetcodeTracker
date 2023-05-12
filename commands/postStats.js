const { SlashCommandBuilder, MessageAttachment } = require("discord.js");
const { checkUserExistence } = require('../utils/mongoose/dbOperations');
const { generateUserProfile } = require('../utils/leetCode/userData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Shows your updated leetcode profile'),
    async execute(interaction){
        const usertag = interaction.user.tag;
        try{
            const username = await checkUserExistence(usertag);
            const pngBuffer = await generateUserProfile(username);
            const attachment = new MessageAttachment(pngBuffer, 'image.png');
            await interaction.reply({files: [attachment]});
        }
        catch(e){
            await interaction.reply(`${e}`);
        }
    }
}