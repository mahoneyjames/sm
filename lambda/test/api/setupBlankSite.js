const moment = require('moment');

require('dotenv').config({ path: 'variables.env' });
process.env.DATA="local";
process.env.BUCKET="localstorage";
//TODO copy the css from wherever the hell it is?
//TODO - need to set the comments up?
//TODO - automate running the browser script
process.env.SITEPATH = `_site/club/`
module.exports = require('../../src/club/http');