require('dotenv').config({ path: 'variables.env' });

//console.log(process.env.AWS_SECRET);
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

const storyClub = require('./src/storyclub');
const sm = require('./src/marmalade');
const site = "storyclub";
async function buildStaticPages()
{
    var helpers = {siteName:"storyclub"};
    await sm.buildPageAndUpload(site,"index","sc-home",{helpers, title:"Storyclub"});
    await sm.buildPageAndUpload(site,"about","sc-about",{helpers, title:"About Storyclub"});
    await sm.buildPageAndUpload(site,"oops","sc-oops",{helpers, title:"Aaaargh"});
}

buildStaticPages();