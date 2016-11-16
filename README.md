# facebook-msg-archive
Archive your facebook messages to JSON

## Overview

This is a node commandline tool which can be used to archive all your facebook messages from a single conversation into a json file. 

## Usage

**Example**

`node --harmony ./bin/run.js -o output.json -e facebook_login@email.com -p facebookpassword -f "Bob Dylan"`

Will output all of your messages to Bob Dylan, in sequential order to `output.json`

## Commandline arguments

You can use the `--help` command to the full commandline interface:

```
  Usage: run [options]

  Options:

    -h, --help                 output usage information
    -o, --output [output]      Filename to output the messages in JSON format to, otherwise to console.
    -e, --email <email>        Facebook email to use
    -p, --password <password>  Facebook password to use
    -f, --friend <friend>      Friend name to fetch the messages of
    -m, --max <n>              Max messages to fetch
    -s, --silent               No log messages output
```

Not providing a `max` argument will fetch all messages. 

## Quirks
This project uses async/await and as such needs atleast Node 7, and to be run with the `--harmony` flag. 
