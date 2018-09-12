const uniqid = require('uniqid');
const storyData = require('./storyData');
const storyHelpers = require('./storyHelpers');
/*
    Generate a random id and return it
*/

const site = "preview";
const objectPrefix = "storyclub/";

exports.registerTheme = async (groupId, theme)=>{}

/*
    Generate a random id
    Save the json to a bucket 
    bucket/themeId/storyId/blahblahblah.json
    Generate html out of the story json, and save it to 
    bucket/themeId/storyId
    Return the storyId
*/
exports.publishThemeStory = async (themeId, story) => {

    if(story.id==undefined || story.id==null || story.id=="")
    {
        story.id = uniqid();
    }
    story = storyHelpers.tidyStory(story);
    if(story.errors.length==0)
    {

        const storyPath = `${objectPrefix}${themeId}/${story.id}`;
        story.path = storyPath;

        //save the json
        await storyData.saveStoryClubStory(site, story);

        //generate html, and save that
        const storyHtml = storyHelpers.markdownToHtml(story.content);

        await storyHelpers.buildPageAndUpload(site, `${story.path}`,"story",{ story,helpers:getHelpers(),html:storyHtml,displayAuthor:false});
    }
    return story;
}


/*
    List any JSON blobs in bucket/themeId
    Use these to generate a single page 
    Save it to bucket/themeId
*/
exports.publishThemeAnonymously = async(themeId)=>{
    const stories = await storyData.listStoryClubThemeStories(site, objectPrefix, themeId);
    const themePath = `${objectPrefix}${themeId}`;
    await storyHelpers.buildPageAndUpload(site, themePath,"storyList",{stories,helpers:getHelpers()});
}

function getHelpers()
{
    return {siteName:"StoryClub"};
}