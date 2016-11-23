const facebookAPI = require('facebook-chat-api');
const Q = require('q');

const Friends = require('./friends');
const Messages = require('./messages');

// Config object with these properties:
// credentials : {
//     email    : facebook email address,
//     password : facebook password
// }
// friend_name  : The name of the friend to fetch messages of
// max_messages : max messages to fetch
//
// Returns an array of message objects from the given friend.
async function getMessages(config)
{
    const apiOptions = {
        logLevel: 'silent'
    };

    const api = await Q.nfcall(facebookAPI, config.credentials, apiOptions);
    const friend = await Friends.findFriendUserByName(api, config.friend_name);
    const messages = await Messages.getMessages(api, friend.id, config.max_messages, null, config.photo_dest)
    return messages;
}

module.exports = {
    getMessages
};
