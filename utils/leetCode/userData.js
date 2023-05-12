const fetch = require('node-fetch');

async function fetchUserData(user){
    try{
        let statsString = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
        let statsJson = await statsString.json();
        return statsJson;
    }
    catch(e){
        console.log(e);
        return {status: 'error', message: e};
    }
}

module.exports = {fetchUserData};