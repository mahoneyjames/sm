const data = require('./src/club/model/data')(require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET}));
const html = require('./src/club/views/html')(require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET}));   

const disqusApi = require("./src/club/disqusApi")(process.env.disqus_accessToken, 
    process.env.disqus_apiKey, 
    process.env.disqus_apiSecret);

const disqusController = require('./src/club/controllers/disqusController')
    (disqusApi,
        process.env.disqus_forum,
        data,
        html);

const siteController = require('./src/club/controllers/siteController')(data,html);


let counter = 0 ;
exports.handler = async function (event, context) {
    
    counter++;
    console.log("Run count since this container was started is %s", counter);

    const {newCommentIds, comments} = await disqusController.syncComments();
    await siteController.refreshBasedOnNewComments(comments, newCommentIds);    
    return comments;
};

