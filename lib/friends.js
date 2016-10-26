var Q = require( 'q' );

// Given the API, return a the user info 
// of a person on your friends list by their name.
// Throws an error if the user isn't your friend.
// Returns Promise
function findFriendUserByName(api, name){
    var userID;
    var promise = 
        Q.nfcall(api.getUserID, name)
        .then(function(data){
            userID = data[0].userID;
            return Q.nfcall(api.getUserInfo, userID);
        })
        .then(function(userInfoMap){
            var userInfo = userInfoMap[userID];
            
            if(!userInfo.isFriend) throw new Error("User not your friend");
            
            // The userinfo object doesnt have an id with it, so add it
            userInfo.id = userID;
            return userInfo;
        });
 
    return promise;
}

module.exports = {
    findFriendUserByName: findFriendUserByName
}