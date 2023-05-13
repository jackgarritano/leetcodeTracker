const { Client } = require('discord.js');
const { checkUsers } = require('./mongoose/dbOperations');
const { finished } = require('stream');

const channel = Client.channels.cache.get('1106759225734082580');

async function repeatingCheckUsers(increment){
    setInterval(async () =>{
        let finishedProblems = await checkUsers();
        if(finishedProblems.length > 0){
            for (const [, cachedUser] of Client.users.cache) {
                if (cachedUser.tag in finishedProblems) {
                    channel.send(`<@${cachedUser.id}> did ${finishedProblems[cachedUser.tag]}`);
                }
            }
        }
    }, increment * 1000)
}

module.exports = { repeatingCheckUsers };