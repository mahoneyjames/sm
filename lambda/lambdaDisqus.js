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
const {listsUsersForCommentIds} = require("./src/club/model/comment/commentHelpers");
let counter = 0 ;
exports.handler = async function (event, context) {
    
    counter++;
    console.log("Run count since this container was started is %s", counter);

    const {newCommentIds, comments} = await disqusController.syncComments();

    if(newCommentIds.length>0)
    {
        //Alwasys update the home page if there is a new comment since we will put in there
        await siteController.rebuildHomePage();

        //Only update the user's page if this is a comment we haven't seen before
        await siteController.rebuildAuthorMissingCommentsPages(listsUsersForCommentIds({comments}, newCommentIds));
    }

    return comments;
};

