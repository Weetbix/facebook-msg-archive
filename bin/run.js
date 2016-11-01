var facebookAPI = require("facebook-chat-api");
var friends = require( '../lib/friends' )
var Q = require( "q" );
var fs = require('fs');


const MAX_MESSAGES = 10;
const MESSAGES_PER_FETCH = 2;

var credentials = 
{
    email :  process.env.FACEBOOK_EMAIL,
    password : process.env.FACEBOOK_PASSWORD
};

function getMessages(api, userid, timestamp )
{
    return Q.nfcall(api.getThreadHistory, userid, 0, MESSAGES_PER_FETCH, timestamp );
}

async function getAllMessages(api, userid, timestamp = null, allMessages = [])
{
    while( allMessages.length < MAX_MESSAGES )
    {
        let messages = await getMessages( api, userid, timestamp );

        allMessages = [ ... messages, ... allMessages ];      
        timestamp    = messages[0].timestamp - 1;
    }
    return allMessages;
}

facebookAPI(
    credentials,
    (err, api) => 
{
    if(err) return console.error(err);

    friends.findFriendUserByName( api, "YOUR FRIEND HERE" )
    .then( user => 
    {
        getAllMessages( api, user.id )
        .then( messages => 
        {
            console.log( messages );
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