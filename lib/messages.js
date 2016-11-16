const Q = require('q');

const MESSAGES_PER_FETCH = 1000;

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

        // No more messages to be fetched
        if (!newMessages || !newMessages.length)
            break;

        messages = [...newMessages, ...messages];
        timestamp = newMessages[0].timestamp - 1;

        console.log(`Fetched ${newMessages.length}/${messages.length} - last timestamp: ${newMessages[0].timestamp}`);
    }

    return messages;
}

module.exports = {
    getMessages
};
