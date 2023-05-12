const fetch = require('node-fetch');

async function fetchUserData(user){
    try{
        let statsData = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
        let statsJson = await statsData.json();
        return statsJson;
    }
    catch(e){
        console.log(`fetch data error: ${e}`);
        return {status: 'error', message: e};
    }
}

async function generateUserProfile(user){
    try{
        let statsData = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
        let statsJson = await statsData.json();
        console.log(JSON.stringify(statsJson));
        let profile = `<svg xmlns="http://www.w3.org/2000/svg" width="301" height="195" viewBox="0 0 301 195" fill="none">
        <style>
          .header {
              font: 600 18px &apos;Segoe UI&apos;, Ubuntu, Sans-Serif;
              fill: #757de8;
              animation: fadeInAnimation 0.8s ease-in-out forwards;
            }
      
            .stat {
              font: 600 14px &apos;Segoe UI&apos;, Ubuntu, &quot;Helvetica Neue&quot;, Sans-Serif;
              fill: #a9fef7;
            }
      
            .easy {
              fill: #00e676;
            }
      
            .medium {
              fill: #ff9100
            }
      
            .hard {
              fill: #f73378
            }
      
            .stagger {
              opacity: 0;
              animation: fadeInAnimation 0.3s ease-in-out forwards;
            }
      
            .bold {
              font-weight: 700
            }
      
            @keyframes acceptanceAnimation {
              from {
                stroke-dashoffset: 377;
              }
              to {
                stroke-dashoffset: 195.7384;
              }
            }
            /* Animations */
      
            @keyframes scaleInAnimation {
              from {
                transform: translate(-5px, 5px) scale(0);
              }
              to {
                transform: translate(-5px, 5px) scale(1);
              }
            }
      
            @keyframes fadeInAnimation {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
        </style>
        <rect x="0.5" y="0.5" rx="4.5" height="99%" stroke="#121212" width="301" fill="#121212" stroke-opacity="1"/>
        <g transform="translate(25, 35)">
          <g transform="translate(0, 0)">
            <text x="0" y="0" class="header">${user}&apos;s LeetCode Stats</text>
          </g>
        </g>
        <g transform="translate(0, 55)">
          <svg x="0" y="0">
            <g transform="translate(0, 0)">
              <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 0)">
                <text class="stat bold" y="12.5">Ranking:</text>
                <text class="stat" x="200" y="12.5">${statsJson.ranking}</text>
              </g>
            </g>
            <g transform="translate(0, 25)">
              <g class="stagger" style="animation-delay: 600ms" transform="translate(25, 0)">
                <text class="stat bold" y="12.5">Total Questions Solved:</text>
                <text class="stat" x="200" y="12.5">${statsJson.totalSolved}/${statsJson.totalQuestions}</text>
              </g>
            </g>
            <g transform="translate(0, 50)">
              <g class="stagger" style="animation-delay: 750ms" transform="translate(25, 0)">
                <text class="stat bold easy" y="12.5">Easy Questions Solved:</text>
                <text class="stat easy" x="200" y="12.5">${statsJson.easySolved}/${statsJson.totalEasy}</text>
              </g>
            </g>
            <g transform="translate(0, 75)">
              <g class="stagger" style="animation-delay: 900ms" transform="translate(25, 0)">
                <text class="stat bold medium" y="12.5">Medium Questions Solved:</text>
                <text class="stat medium" x="200" y="12.5">${statsJson.mediumSolved}/${statsJson.totalMedium}</text>
              </g>
            </g>
            <g transform="translate(0, 100)">
              <g class="stagger" style="animation-delay: 1050ms" transform="translate(25, 0)">
                <text class="stat bold hard" y="12.5">Hard Questions Solved:</text>
                <text class="stat hard" x="200" y="12.5">${statsJson.hardSolved}/${statsJson.totalHard}</text>
              </g>
            </g>
          </svg>
        </g>
      </svg>
      `
        return profile;
    }
    catch(e){
        console.log(`generate profile error: ${e}`);
        return 'error';
    }
}

generateUserProfile('jackgar');

module.exports = {fetchUserData};