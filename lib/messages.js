var Q = require( 'q' );

const MAX_MESSAGES = 10;
const MESSAGES_PER_FETCH = 2;

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

module.exports = {
    getAllMessages
}