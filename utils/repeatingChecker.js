const { initUser, checkUsers } = require('./mongoose/dbOperations');

async function getChannel(client){
    const channel = await client.channels.fetch('1106428718857068607');
    return channel;
}

async function repeatingCheckUsers(client, channel, increment){
    setInterval(async () =>{
        let finishedProblems = await checkUsers();
        if(Object.keys(finishedProblems).length > 0){
            const guild = client.guilds.cache.get('1106428718857068604'); // replace with your guild ID
            await guild.members.fetch();

            for (const [, cachedUser] of guild.members.cache) {
                if (cachedUser.user.tag in finishedProblems) {
                    channel.send(`<@${cachedUser.id}> did ${finishedProblems[cachedUser.user.tag]}`);
                    await initUser(cachedUser.user.tag);
                }
            }
        }
    }, increment * 1000)
}

module.exports = { getChannel, repeatingCheckUsers };