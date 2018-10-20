module.exports =  function(storage){   

    var module = {};

    module.storage = storage;
    module.listThemeStories = async (themeId)=>{return await storage.listObjectsFromJson(`h/${themeId}`);};    
    module.saveThemeStory = async(themeId, story)=> {
        await storage.writeFile(`h/${themeId}/${story.id}/sdlksdaljkdsfaljkdfsljk.json`,JSON.stringify(story), "application/json");
    };
    return module;
};
