const fs = require('fs');
const MessageArchive = require('../lib/main');

const OUTPUT_FILENAME = './output.json';

const credentials = {
    email: process.env.FACEBOOK_EMAIL,
    password: process.env.FACEBOOK_PASSWORD
};

(async function run()
{
    try
    {
        const messages = await MessageArchive.getMessages({
            credentials,
            friend_name: 'YOUR FRIEND HERE',
            max_messages: 100
        });

        const formattedMessages = JSON.stringify(messages, null, 4);
        fs.writeFileSync(OUTPUT_FILENAME, formattedMessages);

        console.log('Wrote to output');
    }
    catch (error)
    {
        console.error(error.error || error);
    }
}());
