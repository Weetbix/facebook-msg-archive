const fs = require('fs');
const program = require('commander');
const MessageArchive = require('../lib/main');

program
  .option('-o, --output [output]', 'Filename to output the messages in JSON format to, otherwise to console.')
  .option('-e, --email <email>', 'Facebook email to use')
  .option('-p, --password <password>', 'Facebook password to use')
  .option('-f, --friend <friend>', 'Friend name to fetch the messages of')
  .option('-m, --max <n>', 'Max messages to fetch', parseInt)
  .option('-s, --silent', 'No log messages output')
  .parse(process.argv);


(async function run()
{
    try
    {
        const config = {
            credentials:
            {
                email: program.email,
                password: program.password
            },
            friend_name: program.friend,
            max_messages: program.max
        };

        const messages = await MessageArchive.getMessages(config);

        const formattedMessages = JSON.stringify(messages, null, 4);
        fs.writeFileSync(program.output, formattedMessages);

        console.log('Wrote to output');
    }
    catch (error)
    {
        console.error(error.error || error);
    }
}());
