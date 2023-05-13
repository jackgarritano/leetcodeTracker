const { checkUsers } = require('./mongoose/dbOperations');
const { finished } = require('stream');

function getChannel(client){
    const channel = client.channels.cache.get('1106759225734082580');
    return channel;
}

async function repeatingCheckUsers(client, channel, increment){
    setInterval(async () =>{
        let finishedProblems = await checkUsers();
        console.log('finishedProblems in repeating: ' + JSON.stringify(finishedProblems));
        if(finishedProblems.length > 0){
            for (const [, cachedUser] of client.users.cache) {
                console.log('cachedUser tag: ' + cachedUser.tag);
                if (cachedUser.tag in finishedProblems) {
                    channel.send(`<@${cachedUser.id}> did ${finishedProblems[cachedUser.tag]}`);
                }
            }
        }
    }, increment * 1000)
}

module.exports = { getChannel, repeatingCheckUsers };