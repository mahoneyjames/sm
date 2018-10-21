const pug = require('pug');
module.exports =  function(storage){   

    var module = {};

    module.storage = storage;

    module.generateInitialThemePage = async (theme)=>{
        buildThemePath(theme);
        await buildPageAndSave(storage, theme.path, "sc-theme", {theme});
    };

    module.generateStoryPreviewPage = async(publicThemeId, story)=>{
        buildStoryPath(publicThemeId,story);
        await buildPageAndSave(storage, story.path, "sc-story",{story, displayAuthor: false});
    }

    module.buildThemeNavigation = async(theme, stories)=>{
        buildThemePath(theme);
        
        await Promise.all(stories.map(async(story)=>{
            buildStoryPath(theme.publicId, story);
            //TODO - deal with navigation links
            await buildPageAndSave(storage, story.path, "sc-story",{story, displayAuthor: false}); 
        }));
        
        await buildPageAndSave(storage, theme.path, "sc-storyList", {theme,stories, displayAuthor:false});
        await buildPageAndSave(storage, `${theme.path}/all`, "sc-storyAll", {theme,stories, displayAuthor:false});
      

    };
    
    
    return module;
};


async function buildPageAndSave (storage, path, view, options){
    options.siteRoot="";
    options.helpers = {siteName:'todo'};

    //console.log(path);

    const fullHtml = pug.renderFile(`./views/${view}.pug`,options);    
    
    await storage.writeFile(path, fullHtml, "text/html");
}

function buildStoryPath(publicThemeId, story)
{
    story.path = `h/${publicThemeId}/${story.publicId}`;
}

function buildThemePath(theme)
{
    theme.path = `h/${theme.publicId}`;
}