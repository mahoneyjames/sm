const htmlGenerator = require('./src/marmalade');
const storyclub = require('./src/storyclub')

exports.publishStory = function(event, context, callback) {
    callback(null, "Success");
};

exports.publishStoryAsync = async (event, context) => {    
    return await htmlGenerator.buildAndPublishStory(event.site, event.story);       
};

exports.buildAuthorIndex = async (event, context) => {
    return await htmlGenerator.buildAuthorIndex(event.site, event.author);        
};

exports.publishStoryClubStory = async(event, context)=>{
    return await storyclub.publishThemeStory(event.themeId, event.story);
}

exports.publishThemeAnonymously = async(event, context)=>{
    return await storyclub.publishThemeAnonymously(event.themeId);
}

exports.genericFunction = async(event, context)=>{
    switch(event.action)
    {
        case "sc-story":
            return await storyclub.publishThemeStory(event.themeId, event.story);
        case "sc-theme":
            return await storyclub.publishThemeAnonymously(event.themeId);
        case "sc-echo":
            return event;
        default:
            return "dim byd!";
    }

}