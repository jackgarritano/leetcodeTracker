const mongoose = require('mongoose');
require('dotenv').config();
const UsersModel = require('./UsersModel');
const { fetchUserData } = require('../leetCode/userData');

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

async function checkUserExistence(discordTag){
    const doc = await UsersModel.findOne({ tag: discordTag });
    if(doc == null){
        throw new Error(`There is no linked a leetCode account for this user. Use /user to do that first.`);
    }
    return doc.user;
}

async function initUser(discordTag, guildId, lcUser) {
    let toUpdate = guildId;
    if(!lcUser){
        lcUser = await checkUserExistence(discordTag);
        console.log('inside if statement, lcUser is: ' + lcUser);
    }
    const userData = await fetchUserData(lcUser);
    console.log('user data: ' + JSON.stringify(userData));
    if (userData.status == 'error') {
        throw new Error(userData.message);
    }
    
    const doc = {
        tag: discordTag,
        user: lcUser,
        easy: userData.easySolved,
        med: userData.mediumSolved,
        hard: userData.hardSolved,
    };
    
    const update = {
        $set: doc,
        $push: { needsUpdates: toUpdate }
    };
    
    try {
        await UsersModel.findOneAndUpdate({ tag: discordTag }, update, { new: true, upsert: true });
        return `User successfully updated to ${lcUser}`;
    }
    catch (e) {
        return `Username could not be saved: ${e}`;
    }
}

async function checkUsers() {
    finishedProblems = {
        servers: [],
    };
    allDocs = await UsersModel.find();
    await Promise.all(allDocs.map(async (doc) => {
        currentData = await fetchUserData(doc.user);
        
        easyFinished = currentData.easySolved - doc.easy;
        medFinished = currentData.mediumSolved - doc.med;
        hardFinished = currentData.hardSolved - doc.hard;
        if(easyFinished > 0 || medFinished > 0 || hardFinished > 0){
            finishedProblems[doc.tag] = finishedProblems[doc.tag] || '';
        }
        if (easyFinished > 0) {
            finishedProblems[doc.tag] = `${easyFinished} easy problem`;
            if (easyFinished > 1) {
                finishedProblems[doc.tag] += 's';
            }
        }
        if (medFinished > 0) {
            if (finishedProblems[doc.tag].length > 0) {
                finishedProblems[doc.tag] += ', ';
            }
            else {
                finishedProblems[doc.tag] = '';
            }
            finishedProblems[doc.tag] += `${medFinished} medium problem`;
            if (medFinished > 1) {
                finishedProblems[doc.tag] += 's';
            }
        }
        if (hardFinished > 0) {
            if (finishedProblems[doc.tag].length > 0) {
                finishedProblems[doc.tag] += ', ';
            }
            else {
                finishedProblems[doc.tag] = '';
            }
            finishedProblems[doc.tag] += `${hardFinished} hard problem`;
            if (hardFinished > 1) {
                finishedProblems[doc.tag] += 's';
            }
        }
        if (doc.tag in finishedProblems){
            finishedProblems[servers].push.apply(finishedProblems[servers], doc.needsUpdates);
        }
        
    }))
    return finishedProblems;
}

module.exports = { checkUserExistence, initUser, checkUsers };