const uniqid = require('uniqid');
const storyData = require('./storyData');
const storyHelpers = require('./storyHelpers');
/*
    Generate a random id and return it
*/

const site = "storyclub";
const objectPrefix = "her/";

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

        

        //generate html, and save that
        const storyHtml = storyHelpers.markdownToHtml(story.content);
        story.html = storyHtml;
        //save the json
        await storyData.saveStoryClubStory(site, story);        

        const pageTitle = story.title!=undefined && story.title != null && story.title!="" ? story.title : "Storyclub";
        await storyHelpers.buildPageAndUpload(site, `${story.path}`,"sc-story",{title: pageTitle, story,helpers:getHelpers(),displayAuthor:false});
    }
    return story;
}

exports.generateThemePage = async(theme)=>{


    if(theme.errors==undefined)
    {
        theme.errors = [];
    }

    if(theme.themeText==undefined || theme.themeText==null || theme.themeText.trim()=="")
    {
        theme.errors[theme.errors.length] = "No theme.themeText supplied";
    }

    if( theme.things==undefined 
        || theme.things==null 
        || theme.things.reduce((validThingCount, currentThing)=>{
        if(currentThing==null || currentThing.trim()=="")
        {
            return validThingCount;
        }
        else 
        {
            return validThingCount+1;
        }
    },0) <3)
    {
        theme.errors[theme.errors.length] = "theme.things does not have 3 entries";
    }
   

    

    if(theme.id==undefined || theme.id==null || theme.id=="")
    {
        theme.id = uniqid();
    }

    if(theme.errors.length==0)
    {
        const themePath = `${objectPrefix}${theme.id}`;
        const authors = [{id:"mahoneyjames@gmail.com", name:"James"},{id:"jeanny@asomething.com", name:"Jenny"}];
        await storyHelpers.buildPageAndUpload(site,themePath,"sc-theme",{theme:theme, title:theme.themeText, helpers:getHelpers(),authors});
    }

    return theme;
}


/*
    List any JSON blobs in bucket/themeId
    Use these to generate a single page 
    Save it to bucket/themeId
*/
exports.publishThemeAnonymously = async(themeId)=>{
    const stories = await storyData.listStoryClubThemeStories(site, objectPrefix, themeId);

    stories.sort((a,b)=>{
        if(a.order==undefined 
            || b.order==undefined
            || a.order==null
            || b.order==null
            || a.order==b.order)
        {
            return 0;
        }
        else if(a.order<b.order)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    });

    const themePath = `${objectPrefix}${themeId}`;
    await storyHelpers.buildPageAndUpload(site, themePath,"sc-storyList",{stories,helpers:getHelpers(), themePath});
    await exports.generateSingleThemeStoryPage(themeId,stories);
}

exports.generateSingleThemeStoryPage = async (themeId,stories)=>{
    const themePath = `${objectPrefix}${themeId}/all`;
    await storyHelpers.buildPageAndUpload(site, themePath,"sc-storyAll",{stories,helpers:getHelpers(),displayAuthor:false});
}

function getHelpers()
{
    return {siteName:"StoryClub", formSubmitUrl:"https://nt1h0wmf85.execute-api.eu-west-2.amazonaws.com/dev/any"};
}