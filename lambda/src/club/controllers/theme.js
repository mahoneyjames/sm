const validateTheme = require('../model/theme/validate');
const {sanitiseId} = require('../helpers');
const validateStory = require('../model/story/validate');
const generateStoryHtml = require('../model/story/buildContentHtml')
const {addCommentCountsToStories,addCommentCountsToThemes} = require("../model/comment/commentHelpers");

module.exports =  function(data, html){   

    var module = {};
    
    this.htmlBuilder = html;
    this.data = data;

    module.createThemeChallenge = async (theme)=>
        {
            if(validateTheme(theme))
            {                
                await this.htmlBuilder.generateInitialThemePage(theme);
                await this.data.saveTheme(theme);                
            }

            return theme;    
        };

    module.setThemeAsLatest = async(publicThemeId)=>
    {
        const theme = await this.data.loadTheme(publicThemeId);
        await data.saveLatestTheme(theme);
        await this.htmlBuilder.generateLatestThemePage(theme);
    }
    
    module.previewStory = async (publicThemeId, story)=>
    {
        return await previewThemeStory(this.htmlBuilder, this.data, publicThemeId, story)
    };

    module.publishThemeForReview = async(publicThemeId)=>
    {
        //await publishThemeForReview(this.htmlBuilder, this.data, publicThemeId);
       return await publishTheme(this.htmlBuilder,this.data, publicThemeId,"review");
    };

    module.rebuildThemePage = async(publicThemeId)=>
    {
        await publishTheme(this.htmlBuilder,this.data, publicThemeId,null);
    }

    module.closeTheme = async(publicThemeId)=>
    {
        return await publishTheme(this.htmlBuilder,this.data, publicThemeId,"complete");
    }

    module.buildThemesPage = async()=>
    {
        var themes = await this.data.cache_getThemesAndStories();
        const commentsDoc = await this.data.cache_getAllComments();

        addCommentCountsToThemes(themes,commentsDoc.comments);
        themes = this.data.sortThemesByDate(themes);
        
        await this.htmlBuilder.buildThemesPage(themes);
    }
    return module;
};

async function previewThemeStory(pageBuilder, dataLayer, publicThemeId, story)
{
    if(validateStory(story))
    {
        generateStoryHtml(story);   
        
        //save the json
        await dataLayer.saveThemeStory(publicThemeId, story);

        //generate a standalone story html page, and save it
        await pageBuilder.generateStoryPreviewPage(publicThemeId, story);
    }

    return story;
}

function editThemeStory(themeId, story)
{
    //TODO - maybe we should simply call republish after an edit to a story

    //validate the story

    //generate the story html

    //save the json

    //generate a standalone story html page, and save it

    //display links/author info, based on the theme status    
}

// async function publishThemeForReview(pageBuilder, dataLayer, publicThemeId)
// {    
//     //load the theme json
//     const theme = await dataLayer.loadTheme(publicThemeId);

//     //load stories for the theme
//     const allStories = await dataLayer.listThemeStories(publicThemeId);

//     //console.log(allStories);
//     //1 - generate and save a theme page, containing links to all the stories
//     //2 - generate and save the story pages, with links to the theme, and next/back links anonymous
    
//     await pageBuilder.buildThemeNavigation(theme,allStories);
    
    
//     theme.status="review";
//     await dataLayer.saveTheme(theme);

// }



async function publishTheme(pageBuilder, dataLayer, publicThemeId, themeStatus)
{    
    //load the theme json
    const theme = (await dataLayer.cache_listThemes()).find(t=>t.publicId==publicThemeId);

    //load stories for the theme
    const allStories = await dataLayer.cache_getThemeStories(publicThemeId);
    
    //console.log(allStories.length);

    const users = await dataLayer.cache_getUsers();
    //augment the stories with author info
    const unknownUser = {id:"oops", publicId:'mystery', name:"unknown...."};
    allStories.map((story)=>{
        
        let storyUser = null; 
        if(story.author)
        {
            storyUser = users.find((user)=>user.id===story.author.toLowerCase());
        }
                
        story.authorUser = storyUser!=null ? storyUser : unknownUser;
    });

    //Work out the previous and next stories
    for(const [index, story] of allStories.entries())
    {
        story.nav = {previous:null, next:null};
        if(index>0)
        {
            story.nav.previous = allStories[index-1];
        }

        if(index<allStories.length-1)
        {
            story.nav.next = allStories[index+1];
        }

    }

    //console.log(allStories);
    //1 - generate and save a theme page, containing links to all the stories
    //2 - generate and save the story pages, with links to the theme, and next/back links anonymous
    if(themeStatus==null)
    {
        themeStatus = theme.status;
    }
    else
    {
        theme.status=themeStatus;
    }
    const commentsForTheme = await dataLayer.cache_getCommentsForTheme(publicThemeId);
    addCommentCountsToStories(allStories, commentsForTheme);

    const displayAuthor = themeStatus==="complete"? true: false;

    await pageBuilder.buildThemeNavigation(theme,allStories, displayAuthor,commentsForTheme);
    
    await dataLayer.saveTheme(theme);

    return theme;

}