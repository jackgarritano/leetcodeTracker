const { initUser, checkUsers } = require('./mongoose/dbOperations');
require('dotenv').config();

async function getChannel(client){
    const channel = await client.channels.fetch('1106428718857068607');
    return channel;
}

async function repeatingCheckUsers(client, channel, increment){
    setInterval(async () =>{
        let finishedProblems = await checkUsers();
        console.log('finishedProblems: ' + JSON.stringify(finishedProblems));
        if(Object.keys(finishedProblems).length > 0){
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            await guild.members.fetch();

            for (const [, cachedUser] of guild.members.cache) {
                if (cachedUser.user.tag in finishedProblems) {
                    channel.send(`<@${cachedUser.id}> did ${finishedProblems[cachedUser.user.tag]}`);
                    let returnMessage = await initUser(cachedUser.user.tag, process.env.GUILD_ID);
                    console.log(returnMessage);
                }
            }
        }
    }, increment * 1000)
}

module.exports = { getChannel, repeatingCheckUsers };