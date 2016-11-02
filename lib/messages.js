const Q = require('q');

const MESSAGES_PER_FETCH = 100;

function getMessagesBeforeTimestamp(api, userid, timestamp, count)
{
    return Q.nfcall(api.getThreadHistory, userid, 0, count, timestamp);
}

async function getMessages(api, userid, maxMessages, timestamp = null)
{
    const fetchAllMessages = typeof (maxMessages) === 'undefined';

    let messages = [];
    while (fetchAllMessages || messages.length < maxMessages)
    {
        const newMessages = await getMessagesBeforeTimestamp(api, userid, timestamp, MESSAGES_PER_FETCH);

        messages = [...newMessages, ...messages];
        timestamp = newMessages[0].timestamp - 1;
    }

    return messages;
}

module.exports = {
    getMessages
};
