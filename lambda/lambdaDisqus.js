
const dataStorage = require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET});
const htmlStorage = require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET});   

exports.handler = async function (event, context) {
	console.log("started");
    const disqusController = require('./src/club/controllers/disqusController')
    (process.env.disqus_accessToken, 
        process.env.disqus_apiKey, 
        process.env.disqus_apiSecret,
        process.env.disqus_forum,
        dataStorage,
        htmlStorage);

    const comments = await disqusController.syncAllComments();

    const siteController = require('./src/club/controllers/siteController')(dataStorage,htmlStorage);
    await siteController.rebuildHomePage();

    return comments;
};