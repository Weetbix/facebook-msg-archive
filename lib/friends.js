var Q = require( 'q' );

// Given the API, return a the user info 
// of a person on your friends list by their name.
// Throws an error if the user isn't your friend.
async function findFriendUserByName(api, name){
    let data = await Q.nfcall(api.getUserID, name);
    let userID = data[0].userID;
    let userInfoMap = await Q.nfcall(api.getUserInfo, userID);
    
    var userInfo = userInfoMap[userID];
    if(!userInfo.isFriend) 
        throw new Error("User not your friend");
    
    // The userinfo object doesnt have an id with it, so add it
    userInfo.id = userID;
    return userInfo;
}

module.exports = {
    findFriendUserByName
}