const mongoose = require("mongoose");
require("dotenv").config();
const UsersModel = require("./UsersModel");
const { fetchUserData } = require("../leetCode/userData");

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

async function checkUserExistence(discordId) {
  const doc = await UsersModel.findOne({ discordId: discordId });
  if (doc == null) {
    throw new Error(
      `There is no linked leetCode account for this user. Use /user to do that first.`
    );
  }
  return doc.user;
}

async function initUser(discordTag, discordId, guildId, lcUser) {
  let toUpdate = guildId;
  if (!lcUser) {
    lcUser = await checkUserExistence(discordId);
  }
  const userData = await fetchUserData(lcUser);
  console.log("user data: " + JSON.stringify(userData));
  if (userData.status == "error") {
    throw new Error(userData.message);
  }

  const doc = {
    tag: discordTag,
    user: lcUser,
    discordId: discordId,
    easy: userData.easySolved,
    med: userData.mediumSolved,
    hard: userData.hardSolved,
  };

  const update = {
    $set: doc,
    $addToSet: { needsUpdates: toUpdate },
  };

  try {
    await UsersModel.findOneAndUpdate({ discordId: discordId }, update, {
      new: true,
      upsert: true,
    });
    return `User successfully updated to ${lcUser}`;
  } catch (e) {
    return `Username could not be saved: ${e}`;
  }
}

async function checkUsers() {
  serversSet = new Set();
  finishedProblems = {
    servers: [],
  };
  allDocs = await UsersModel.find();
  await Promise.all(
    allDocs.map(async (doc) => {
      currentData = await fetchUserData(doc.user);

      easyFinished = currentData.easySolved - doc.easy;
      medFinished = currentData.mediumSolved - doc.med;
      hardFinished = currentData.hardSolved - doc.hard;
      if (easyFinished > 0 || medFinished > 0 || hardFinished > 0) {
        finishedProblems[doc.discordId] = finishedProblems[doc.discordId] || "";
      }
      if (easyFinished > 0) {
        finishedProblems[doc.discordId] = `${easyFinished} easy problem`;
        if (easyFinished > 1) {
          finishedProblems[doc.discordId] += "s";
        }
      }
      if (medFinished > 0) {
        if (finishedProblems[doc.discordId].length > 0) {
          finishedProblems[doc.discordId] += ", ";
        } else {
          finishedProblems[doc.discordId] = "";
        }
        finishedProblems[doc.discordId] += `${medFinished} medium problem`;
        if (medFinished > 1) {
          finishedProblems[doc.discordId] += "s";
        }
      }
      if (hardFinished > 0) {
        if (finishedProblems[doc.discordId].length > 0) {
          finishedProblems[doc.discordId] += ", ";
        } else {
          finishedProblems[doc.discordId] = "";
        }
        finishedProblems[doc.discordId] += `${hardFinished} hard problem`;
        if (hardFinished > 1) {
          finishedProblems[doc.discordId] += "s";
        }
      }
      if (doc.discordId in finishedProblems) {
        for (let ind in doc.needsUpdates) {
          serversSet.add(doc.needsUpdates[ind]);
        }
      }
    })
  );
  finishedProblems["servers"] = Array.from(serversSet);
  return finishedProblems;
}

module.exports = { checkUserExistence, initUser, checkUsers };
