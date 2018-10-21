const uniqid = require('uniqid');

module.exports =  function(storage){   

    var module = {};

    module.storage = storage;

    module.listThemeStories = async (publicThemeId)=>{
        return await storage.listObjectsFromJson(`data/${publicThemeId}/stories`);
    };

    module.saveThemeStory = async(publicThemeId, story)=> {
        if(!story.id)
        {
            story.id = uniqid();
        }
        await storage.writeFile(`data/${publicThemeId}/stories/${story.id}.json`,JSON.stringify(story), "application/json");
    };

    module.saveTheme = async(theme)=>{
        if(!theme.id)
        {
            theme.id = uniqid();
        }
        await storage.writeFile(`data/${theme.publicId}/theme.json`, JSON.stringify(theme), "application/json");
    };

    module.loadTheme = async(publicThemeId)=>{        
        return await storage.readObjectFromJson(`data/${publicThemeId}/theme.json`);
    };
    return module;
};
