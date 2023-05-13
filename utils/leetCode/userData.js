const fetch = require('node-fetch');
const sharp = require('sharp');
const fs = require('fs');

async function fetchUserData(username) {
  try {
    const query = `query getUserProfile($username: String!) { 
          allQuestionsCount { 
            difficulty count 
          } 
          matchedUser(username: $username) { 
            contributions { 
              points 
            } 
            profile { 
              reputation ranking 
            } 
            submissionCalendar 
            submitStats { 
              acSubmissionNum { 
                difficulty count submissions 
              } 
              totalSubmissionNum { 
                difficulty count submissions 
              } 
            } 
          } 
        }`;

    const data = {
      query,
      variables: {username},
    };

    const statsData = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${username}/`,
      },
      body: JSON.stringify(data),
    })
    let statsJson = await statsData.json();
    if('errors' in statsJson){
      return {status: 'error', message: statsJson['errors'][0].message}
    }
    else{
        totalSolved = statsJson.data.matchedUser.submitStats.acSubmissionNum.find(item => item.difficulty === 'All').count;
        totalQuestions = statsJson.data.allQuestionsCount.find(item => item.difficulty === 'All').count;
        easySolved = statsJson.data.matchedUser.submitStats.acSubmissionNum.find(item => item.difficulty === 'Easy').count;
        totalEasy = statsJson.data.allQuestionsCount.find(item => item.difficulty === 'Easy').count;
        mediumSolved = statsJson.data.matchedUser.submitStats.acSubmissionNum.find(item => item.difficulty === 'Medium').count;
        totalMedium = statsJson.data.allQuestionsCount.find(item => item.difficulty === 'Medium').count;
        hardSolved = statsJson.data.matchedUser.submitStats.acSubmissionNum.find(item => item.difficulty === 'Hard').count;
        totalHard = statsJson.data.allQuestionsCount.find(item => item.difficulty === 'Hard').count;
        ranking = statsJson.data.matchedUser.profile.ranking;
      return{
        status: 'success',
        totalSolved,
        totalQuestions,
        easySolved,
        totalEasy,
        mediumSolved,
        totalMedium,
        hardSolved,
        totalHard,
        ranking,
      }
    }
  }
  catch (e) {
    return {status: 'error', message: e};
  }
}

/*async function fetchUserData(user) {
  try {
    //let statsData = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);

    return statsJson;
  }
  catch (e) {
    console.log(`fetch data error: ${e}`);
    return { status: 'error', message: e };
  }
}*/

async function generateUserProfile(user) {
  try {
    let statsData = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
    let statsJson = await statsData.json();
    let profile = `<svg xmlns="http://www.w3.org/2000/svg" width="330" height="195" viewBox="0 0 330 195" fill="none">
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
      
            .bold {
              font-weight: 700
            }

        </style>
        <rect x="0.5" y="0.5" rx="4.5" height="99%" stroke="#121212" width="330" fill="#121212" stroke-opacity="1"/>
        <g transform="translate(25, 35)">
          <g transform="translate(0, 0)">
            <text x="0" y="0" class="header">${user}&apos;s LeetCode Stats</text>
          </g>
        </g>
        <g transform="translate(0, 55)">
          <svg x="0" y="0">
            <g transform="translate(0, 0)">
              <g transform="translate(25, 0)">
                <text class="stat bold" y="12.5">Ranking:</text>
                <text class="stat" x="200" y="12.5">${statsJson.ranking}</text>
              </g>
            </g>
            <g transform="translate(0, 25)">
              <g transform="translate(25, 0)">
                <text class="stat bold" y="12.5">Total Questions Solved:</text>
                <text class="stat" x="200" y="12.5">${statsJson.totalSolved}/${statsJson.totalQuestions}</text>
              </g>
            </g>
            <g transform="translate(0, 50)">
              <g transform="translate(25, 0)">
                <text class="stat bold easy" y="12.5">Easy Questions Solved:</text>
                <text class="stat easy" x="200" y="12.5">${statsJson.easySolved}/${statsJson.totalEasy}</text>
              </g>
            </g>
            <g transform="translate(0, 75)">
              <g transform="translate(25, 0)">
                <text class="stat bold medium" y="12.5">Med Questions Solved:</text>
                <text class="stat medium" x="200" y="12.5">${statsJson.mediumSolved}/${statsJson.totalMedium}</text>
              </g>
            </g>
            <g transform="translate(0, 100)">
              <g transform="translate(25, 0)">
                <text class="stat bold hard" y="12.5">Hard Questions Solved:</text>
                <text class="stat hard" x="200" y="12.5">${statsJson.hardSolved}/${statsJson.totalHard}</text>
              </g>
            </g>
          </svg>
        </g>
      </svg>
      `
    imageBuffer = await sharp(Buffer.from(profile))
      .resize(1000)
      .png()
      .toBuffer()
    return imageBuffer;
  }
  catch (e) {
    console.log(`generate profile error: ${e}`);
    return 'error';
  }
}

/*leetcodeReq('gangugangu').then((data)=>{
  console.log(JSON.stringify(data));
})*/

module.exports = { fetchUserData, generateUserProfile };