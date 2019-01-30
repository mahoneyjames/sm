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
                await this.htmlBuilder.buildStaticPages(theme);
            }

            return theme;    
        };

    module.previewStory = async (publicThemeId, story)=>
    {
        return await previewThemeStory(this.htmlBuilder, this.data, publicThemeId, story)
    };

    module.publishThemeForReview = async(publicThemeId)=>
    {
        //await publishThemeForReview(this.htmlBuilder, this.data, publicThemeId);
        await publishTheme(this.htmlBuilder,this.data, publicThemeId,"review");
    }

    module.closeTheme = async(publicThemeId)=>
    {
        await publishTheme(this.htmlBuilder,this.data, publicThemeId,"complete");
    }

    module.buildThemesPage = async()=>
    {
        var themes = await this.data.listThemes();
        themes = themes.sort((a,b)=>{
                if(!a.deadline || !b.deadline)
                {
                    return 0;
                }
                else if(a.deadline > b.deadline)
                {
                    return -1;
                }
                else
                {
                    return 1;
                }
        });
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



async function publishTheme(pageBuilder, dataLayer, publicThemeId, themeStatus)
{    
    //load the theme json
    const theme = await dataLayer.loadTheme(publicThemeId);

    //load stories for the theme
    const allStories = await dataLayer.listThemeStories(publicThemeId);

    const users = await dataLayer.loadUsers();
    //augment the stories with author info
    const unknownUser = {id:"oops", name:"unknown...."};
    allStories.map((story)=>{
        const storyUser = users.find((user)=>user.id===story.author.toLowerCase());
                
        story.authorUser = storyUser!=null ? storyUser : unknownUser;
    });

    console.log(allStories);
    //1 - generate and save a theme page, containing links to all the stories
    //2 - generate and save the story pages, with links to the theme, and next/back links anonymous
    
    const displayAuthor = themeStatus==="complete"? true: false;

    await pageBuilder.buildThemeNavigation(theme,allStories, displayAuthor);
    
    
    theme.status=themeStatus;

 
    await dataLayer.saveTheme(theme);

}