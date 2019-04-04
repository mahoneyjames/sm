const data = require('./src/club/model/data')(require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET}));
const html = require('./src/club/views/html')(require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET}));   

const disqusController = require('./src/club/controllers/disqusController')
    (process.env.disqus_accessToken, 
        process.env.disqus_apiKey, 
        process.env.disqus_apiSecret,
        process.env.disqus_forum,
        data,
        html);

const siteController = require('./src/club/controllers/siteController')(data,html);

exports.handler = async function (event, context) {
	

    const comments = await disqusController.syncAllComments();

    await siteController.rebuildHomePage();
    await siteController.rebuildAuthorMissingCommentsPages();

    return comments;
};

