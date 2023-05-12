const fetch = require('node-fetch');
export {fetchUserData};

async function fetchUserData(user){
    let statsString = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
    let statsJson = await statsString.json();
    return statsJson;
}