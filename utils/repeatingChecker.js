const { initUser, checkUsers } = require('./mongoose/dbOperations');
require('dotenv').config();

async function getChannel(client){
    const channel1 = await client.channels.fetch('1106428718857068607');
    const channel2 = await client.channels.fetch('1076408499002687522');
    return {
        '1106428718857068604': channel1,
        '1074155409067221083': channel2,
    };
}

async function repeatingCheckUsers(client, channels, increment){
    setInterval(async () =>{
        let finishedProblems = await checkUsers();
        console.log('finishedProblems: ' + JSON.stringify(finishedProblems));
        if(Object.keys(finishedProblems).length > 1){
            for(let i=0; i<finishedProblems['servers'].length; i++){
                const guildId = finishedProblems['servers'][i];
                const guild = client.guilds.cache.get(guildId);
                const channel = channels[guildId];
                await guild.members.fetch();

                for (const [, cachedUser] of guild.members.cache) {
                    if (cachedUser.user.tag in finishedProblems) {
                        channel.send(`<@${cachedUser.id}> did ${finishedProblems[cachedUser.user.tag]}`);
                        let returnMessage = await initUser(cachedUser.user.tag, process.env.GUILD_ID);
                        console.log(returnMessage);
                    }
                }
            }
        }
    }, increment * 1000)
}

module.exports = { getChannel, repeatingCheckUsers };