var facebookAPI = require("facebook-chat-api");
var Q = require( "q" );
var fs = require('fs');

var Friends = require( '../lib/friends' );
var Messages = require( '../lib/messages' );

const OUTPUT_FILENAME = './output.json';

var credentials = 
{
    email :  process.env.FACEBOOK_EMAIL,
    password : process.env.FACEBOOK_PASSWORD
};

(async function(){
    try 
    {
        let api = await Q.nfcall( facebookAPI, credentials );
        let friend = await Friends.findFriendUserByName( api, "YOUR FRIEND HERE" );
        let messages = await Messages.getAllMessages( api, friend.id );

        const formattedMessages = JSON.stringify( messages, null, 4 );
        await Q.nfcall( fs.writeFile, OUTPUT_FILENAME, formattedMessages );

        console.log( 'Wrote to output' );
    }
    catch( error )
    {
        console.error( error.error || error );
    }
})();
