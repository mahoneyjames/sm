const validateTheme = require('../model/theme/validate');
const {sanitiseId} = require('../helpers');
const validateStory = require('../model/story/validate');
const generateStoryHtml = require('../model/story/buildContentHtml')

module.exports =  function(storageForData, storageForHtml){   

    var module = {};
    
    this.htmlBuilder = require('../views/html')(storageForHtml);
    this.data = require('../model/data')(storageForData);

    module.createThemeChallenge = async (theme)=>
        {
            if(validateTheme(theme))
            {
                
                await this.htmlBuilder.generateInitialThemePage(theme);
                await this.data.saveTheme(theme);
            }

            return theme;    
        };

    module.previewStory = async (publicThemeId, story)=>
    {
        return await previewThemeStory(this.htmlBuilder, this.data, publicThemeId, story)
    };

    module.publishThemeForReview = async(publicThemeId)=>
    {
        await publishThemeForReview(this.htmlBuilder, this.data, publicThemeId);
    }

    module.buildThemesPage = async()=>
    {
        var themes = await this.data.listThemes();
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

async function publishThemeForReview(pageBuilder, dataLayer, publicThemeId)
{    
    //load the theme json
    const theme = await dataLayer.loadTheme(publicThemeId);

    //load stories for the theme
    const allStories = await dataLayer.listThemeStories(publicThemeId);

    //console.log(allStories);
    //1 - generate and save a theme page, containing links to all the stories
    //2 - generate and save the story pages, with links to the theme, and next/back links anonymous
    
    await pageBuilder.buildThemeNavigation(theme,allStories);
    
    
    theme.status="review";
    await dataLayer.saveTheme(theme);

}

function closeThemeChallenge(themeId)
{

    //load the theme json

    //load stories for the theme

    //generate and save a theme page, containing links to all the stories
    //perhaps put in author names here, a feedback summary or something

    //generate and save the story pages, with links to the theme, and next/back links
    //include the author's name

}