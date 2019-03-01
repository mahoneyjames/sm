const debug = require('debug')("data");
const uniqid = require('uniqid');
const moment = require('moment');
const {Comment} = require('./comment');

module.exports =  function(storage){   

    var module = {};

    module.storage = storage;

    module.listAllThemesAndStories = async () =>{
        //TODO - store this doc in s3? or does this build it and cache it?
        
        const themes = await module.listThemes();
        return await Promise.all(themes.map (async (theme)=>
        
        {theme.stories = await module.listThemeStories(theme.publicId);
            //console.log(theme.stories);
            return theme;
            }
        ));

    }

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

    module.saveLatestTheme = async(theme)=>{
        await storage.writeFile(`data/latestTheme.json`, JSON.stringify(theme), "application/json");        
    }
    module.getLatestTheme = async()=>{
        return await storage.readObjectFromJson(`data/latestTheme.json`);
    }

    module.loadUsers = async ()=>{
        const userJson = await storage.readObjectFromJson(`data/users.json`);
        
        if(userJson.users)
        {
            return userJson.users.map(user=>{
                user.join = moment(user.joined);
                return user;
            });
        }
        else{

            return userJson.usersGoogle.map((user)=>({id:user.id.toLowerCase(), 
                                                    name: user.name, 
                                                    disqusIds: user.disqusIds!=undefined ? user.disqusIds : user.disqusId.split(","),
                                                    joined: moment(user.joined)} ));
        }
    }

    module.saveUsers = async (users)=>{
        await storage.writeFile('data/users.json',JSON.stringify(users), "application/json" );
    }
    module.saveCommentDoc = async(fullDoc)=>{
        await storage.writeFile(`data/everything.json`, JSON.stringify(fullDoc),"application/json");
    }

    module.loadCommentDoc = async()=>{
        return await storage.readObjectFromJson(`data/everything.json`);
    }

    module.saveAllComments = async(commentsDoc)=>{

        if(commentsDoc.comments==undefined)
        {
            commentsDoc.comments = [];
        }

        if(commentsDoc.lastCommentData==undefined)
        {
            commentsDoc.lastCommentDate = null;
        }
        await storage.writeFile(`data/comments.json`, JSON.stringify(commentsDoc),"application/json");
    }


    /*
        {
            lastCommentDate:"datetime",
            comments:[]
        }
    */
    module.listAllComments = async()=>{
        const commentsDoc = await storage.readObjectFromJson(`data/comments.json`);

        commentsDoc.comments = commentsDoc.comments.map((comment)=>new Comment(comment));

        return commentsDoc;
    }

    module.sortThemesByDate = (themes)=>{
        return themes.sort((a,b)=>{
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
    }

    

    return module;
};
