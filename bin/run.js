const fs = require('fs');
const program = require('commander');
const MessageArchive = require('../lib/main');

program
  .option('-o, --output [output]', 'Filename to output the messages in JSON format to, otherwise to console.')
  .option('-e, --email <email>', 'Facebook email to use')
  .option('-p, --password <password>', 'Facebook password to use')
  .option('-f, --friend <friend>', 'Friend name to fetch the messages of')
  .option('-m, --max <n>', 'Max messages to fetch', parseInt)
  .option('-i, --images [dir]', 'Download photos from the messages to the desired location')
  .option('-s, --silent', 'No log messages output')
  .parse(process.argv);


(async function run()
{
    let messages;

    try
    {
        const config = {
            credentials:
            {
                email: program.email,
                password: program.password
            },
            friend_name: program.friend,
            max_messages: program.max,
            photo_dest: program.images
        };

        messages = await MessageArchive.getMessages(config);
    }
    catch (error)
    {
        console.error(error.error || error);
    }
    finally
    {
        if (messages)
        {
            const formattedMessages = JSON.stringify(messages, null, 4);
            fs.writeFileSync(program.output, formattedMessages);

            console.log(`Finished writing messags to ${program.output}`);
        }
    }
}());
