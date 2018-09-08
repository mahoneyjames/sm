const htmlGenerator = require('./src/marmalade');

exports.publishStory = function(event, context, callback) {
    callback(null, "Success");
};

exports.publishStoryAsync = async (event, context) => {    
    return await htmlGenerator.buildAndPublishStory(event.site, event.story);       
};

exports.buildAuthorIndex = async (event, context) => {
    return await htmlGenerator.buildAuthorIndex(event.site, event.author);        
};
