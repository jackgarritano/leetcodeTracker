const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { checkUserExistence } = require('../utils/mongoose/dbOperations');
const { generateUserProfile } = require('../utils/leetCode/userData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Shows updated leetcode profile')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('optionally @ a user')),
    async execute(interaction){
        let targetUser;
            if(interaction.options.getUser('target')){
                targetUser = interaction.options.getUser('target').tag;
            }
            else{
                targetUser = interaction.user.tag;
            }
        try{
            const username = await checkUserExistence(targetUser);
            const pngBuffer = await generateUserProfile(username);
            const attachment = new AttachmentBuilder(pngBuffer, {name: 'profile.png'});
            await interaction.reply({files: [attachment]});
        }
        catch(e){
            await interaction.reply(`${e}`);
        }
    }
}