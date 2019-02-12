const debug = require('debug')("data");
const uniqid = require('uniqid');
const moment = require('moment');

module.exports =  function(storage){   

    var module = {};

    module.storage = storage;

    module.listThemeStories = async (publicThemeId)=>{
        return await storage.listObjectsFromJson(`data/${publicThemeId}/stories`);
    };

    module.listThemes = async()=>{
        return await storage.listObjectsFromJson(`data/themes`);
    }

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
        await storage.writeFile(`data/themes/${theme.publicId}.json`, JSON.stringify(theme), "application/json");
    };

    module.loadTheme = async(publicThemeId)=>{        
        return await storage.readObjectFromJson(`data/themes/${publicThemeId}.json`);
    };

    module.loadUsers = async ()=>{
        const userJson = await storage.readObjectFromJson(`data/users.json`);
        
        return userJson.usersGoogle.map((user)=>({id:user.id.toLowerCase(), 
                                                    name: user.name, 
                                                    disqusIds:user.disqusId.split(","),
                                                    joined: moment(user.joined)} ));
    }

    module.saveCommentDoc = async(fullDoc)=>{
        await storage.writeFile(`data/everything.json`, JSON.stringify(fullDoc),"application/json");
    }

    module.loadCommentDoc = async()=>{
        return await storage.readObjectFromJson(`data/everything.json`);
    }
    return module;
};
