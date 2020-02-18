const moment = require('moment');
const LogFactory = require("log2/log-factory");

//Use bunyan for logging when running our lambda project locally
//The claudia local api helper library already uses bunyan
//This allows us to write our own output to a log file
//Not having any success with filtering *out* the claudia api logs using the bunyan CLI tool
class LogToBunyan
{

    constructor()
    {
        const bunyan = require('bunyan');
        this.logger =  bunyan.createLogger({
            name: "local-api-test",
            streams: [
                {
                  level: 'info',
                  path: '/temp/myapp-error.log'  // log info and above to a file
                },
                {
                    level: 'info',
                    stream: process.stdout            // log INFO and above to stdout
                  }]
        });    
    }

    log(message)
    {
        this.logger.info({details: JSON.parse(message)});
    }
    info(message)
    {
        console.info(message);
    }
    warn(message)
    {
        console.warn(message);
    }
    error(message)
    {
        console.error(message);
    }    
}

LogFactory.setOutput(new LogToBunyan());

require('dotenv').config({ path: 'variables.env' });
process.env.DATA="local";
process.env.BUCKET="localstorage";
//TODO copy the css from wherever the hell it is?
//TODO - need to set the comments up?
//TODO - automate running the browser script
process.env.SITEPATH = `_site/club/`
module.exports = require('../../src/club/http');