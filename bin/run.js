var facebookAPI = require("facebook-chat-api");
var friends = require( '../lib/friends' )
var Q = require( "q" );
var fs = require('fs');

var credentials = 
{
    email :  process.env.FACEBOOK_EMAIL,
    password : process.env.FACEBOOK_PASSWORD
};

function getMessages(api, userid, timestamp )
{
    return Q.nfcall(api.getThreadHistory, userid, 0, 100, timestamp );
}

function getAllMessages(api, userid, timestamp = null, messages = []){
    return getMessages(api, userid, timestamp)
        .then(newMessages => {
            if (newMessages && newMessages.length
                && messages.length < 2000 ) 
            {
                console.log( `saving [${messages.length}]` );
                messages = [ ... newMessages, ... messages ];
                return getAllMessages( api, userid, newMessages[0].timestamp - 1, messages );
            } else {
                return messages;
            }
        });
}

facebookAPI(
    credentials,
    (err, api) => 
{
    if(err) return console.error(err);

    friends.findFriendUserByName( api, "YOUR FRIENDS NAME HERE" )
    .then( user => 
    {
        getAllMessages( api, user.id )
        .then( messages => 
        {
            fs.writeFile(
                './output.json',
                JSON.stringify( messages, null, 4 ),
                err => {
                    if( err )
                        console.error( err );
                    else 
                        console.log( "wrote to output" );
                }
            )
        } );
    } );
});