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
        await buildPageAndSave(storage, story.path, "sc-story",{story, 
                                                                displayAuthor: false, 
                                                                title:story.title});

    }

    module.buildThemeNavigation = async(theme, stories, displayAuthor = false)=>{
        buildThemePath(theme);
        
        await Promise.all(stories.map(async(story)=>{
            buildStoryPath(theme.publicId, story);
            //TODO - deal with navigation links
            await buildPageAndSave(storage, story.path, "sc-story",{story, 
                                                                    displayAuthor: displayAuthor,
                                                                    title:story.title,
                                                                    theme,
                                                                    hack_backLink: getThemeLinkDetails(theme)}); 
        }));
        
        await buildPageAndSave(storage, theme.path, "sc-storyList", {theme,
            stories, 
            displayAuthor: displayAuthor,
            title: "storyclub - " + theme.themeText});

        await buildPageAndSave(storage, `${theme.path}/all`, "sc-storyAll", {theme,
                                                                    stories, 
                                                                    title: "storyclub - " + theme.themeText, 
                                                                    displayAuthor: displayAuthor,
                                                                    hack_backLink: getThemeLinkDetails(theme)});
      

    };

    module.buildThemesPage = async(themes)=>{

        //group the themes by year
        //TODO - do this here? or a utility function in the actual view
        //TODO - also - ugh, horrid grouping code, must be something simpler!
        var themesGrouped = themes.reduce((group, theme)=>{
            
            let year = "sometime";
            if(theme.deadline)
            {
                year = theme.deadline.slice(0,4);
            }
            
            if(!group.has(year))
            {                
                group.set(year, new Set());             
            }
            group.get(year).add(theme);
            return group;
        }, new Map());

        var themesGroupedArray = new Array();
        var years = new Array();
        
        for ( const [key,val] of themesGrouped)
        {
            var themesInner = new Array();
            val.forEach((theme)=>themesInner[themesInner.length] = theme);
            themesGroupedArray[themesGroupedArray.length] =  {year: key, themes:themesInner};
            years[years.length] = key;
        }

        
        for(var index in themesGroupedArray)
        {
            const year = themesGroupedArray[index];
            await buildPageAndSave(storage, `themes-${year.year}`, "sc-themeList",{themes:year.themes, year:year.year, years});
        
        }
        //var themesGrouped = themesGrouped.map((year)=> new {year: year.key, themes:year.value});

        
        //console.log(themes); 
        
    }
    
    module.buildStaticPages = async(theme)=>{
        await buildPageAndSave(storage,"index","sc-home",{title:"storyclub",theme});
        await buildPageAndSave(storage,"about","sc-about",{title:"about storyclub"});
        await buildPageAndSave(storage,"oops","sc-oops",{title:"Aaaargh"});

    }

    module.buildHomePage = async(theme, comments)=>
    {
        await buildPageAndSave(storage,"index","sc-home",{title:"storyclub",theme,comments});
    }

    module.stats_buildCommentPage = async(leagueTable)=>{
        await buildPageAndSave(storage, "stats/comments","sc-comments", {title:"top commenters", leagueTable});
    }

    module.buildStoryPath =buildStoryPath;
    
    return module;
};


async function buildPageAndSave (storage, path, view, options){
    options.siteRoot="";
    options.helpers = {siteName:'storyclub',
                     dump: function(thing){return JSON.stringify(thing);}};

    //console.log(options);

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

function getThemeLinkDetails(theme)
{
    return {path:theme.path, displayText: theme.themeText};
}