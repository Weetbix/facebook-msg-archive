const Q = require('q');
const request = require('request');
const path = require( 'path' );
const fs = require('fs');

const MESSAGES_PER_FETCH = 1000;

async function downloadImage( url, dest )
{
    const filename = path.basename(url).split( '?oh' )[0];
    const filePath = path.join(dest, filename);

    return new Promise((resolve, reject) =>
    {
        request(url)
            .on('error', e => reject(e) )
            .pipe(fs.createWriteStream(filePath))
            .on('finish', e => resolve());
    } );
}

function getMessagesBeforeTimestamp(api, userid, timestamp, count)
{
    return Q.nfcall(api.getThreadHistory, userid, 0, count, timestamp);
}

async function downloadPhotosFromMessages(messages, dest)
{
    const imageURLS = messages.filter(m => m.attachments
                                       && m.attachments.length > 0
                                       && m.attachments[0].type === 'photo')
                              .map(m => m.attachments[0].previewUrl);

    if(imageURLS.length)
    {
        console.log( `downloading ${imageURLS.length} images`);
        const promises = imageURLS.map( img =>
        {
            return downloadImage(img, dest);
        });
        await Promise.all(promises);
    }
}

async function getMessages(api, userid, maxMessages, timestamp = null, photoDesination)
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

        if(photoDesination)
        {
            await downloadPhotosFromMessages(newMessages, photoDesination);
        }
    }

    return messages;
}

module.exports = {
    getMessages
};
