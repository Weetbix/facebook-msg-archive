const fs = require('fs');
const facebookAPI = require('facebook-chat-api');
const Q = require('q');

const Friends = require('../lib/friends');
const Messages = require('../lib/messages');

const OUTPUT_FILENAME = './output.json';

const credentials = {
    email: process.env.FACEBOOK_EMAIL,
    password: process.env.FACEBOOK_PASSWORD
};

(async function run()
{
    try
    {
        const api = await Q.nfcall(facebookAPI, credentials);
        const friend = await Friends.findFriendUserByName(api, 'YOUR FRIEND HERE');
        const messages = await Messages.getAllMessages(api, friend.id);

        const formattedMessages = JSON.stringify(messages, null, 4);
        fs.writeFileSync(OUTPUT_FILENAME, formattedMessages);

        console.log('Wrote to output');
    }
    catch (error)
    {
        console.error(error.error || error);
    }
}());
