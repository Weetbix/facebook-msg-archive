var facebookAPI = require("facebook-chat-api");
var Q = require( "q" );
var fs = require('fs');

var friends = require( '../lib/friends' );
var messages = require( '../lib/messages' );

var credentials = 
{
    email :  process.env.FACEBOOK_EMAIL,
    password : process.env.FACEBOOK_PASSWORD
};

facebookAPI(
    credentials,
    (err, api) => 
{
    if(err) return console.error(err);

    friends.findFriendUserByName( api, "YOUR FRIEND HERE" )
    .then( user => 
    {
        messages.getAllMessages( api, user.id )
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