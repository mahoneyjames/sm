const logger = require("log2")("data");
const trackCache =(thing)=> logger.track("cache").logThing(thing);
const uniqid = require('uniqid');
const moment = require('moment');
const {Comment} = require('./comment');
const {groupByIsoDate,mapToArray} = require('../helpers');

module.exports =  function(storage){   

    var module = {};

    module.cache = {};
    module.storage = storage;

    const CACHE_USERS = "users";
    const CACHE_THEMES_AND_STORIES = "all-themes-and-stories";
    const CACHE_COMMENTS = "comments";

    module.resetCache = ()=>{module.cache={}};
    module.resetCacheForComments = ()=>{module.cache[CACHE_COMMENTS] = null;};
    
    module.getCacheItem = async (key, loader, reloadFromStorage=false)=>
    {
        
        
        if(reloadFromStorage==true)
        {            
            trackCache({method:"getCacheItem",reloadFromStorage:true, key});
            module.cache[key] = (await loader());
        }
        else if(!module.cache[key] || module.cache[key]==null)
        {            
            trackCache({method:"getCacheItem",cacheMiss:true, key});
            const results = await loader();
            //debug(results);
            module.cache[key] = results;
        }
        //debug(module.cache);
        
        return module.cache[key];
    }

    module.setCacheItem = (key, data)=>
    {
        module.cache[key] = data;
    }

    module.updateCacheItem = (key, updatorFunction)=>
    {
        if(module.cache[key])
        {
           module.cache[key] =  updatorFunction(module.cache[key]);
        }
        else
        {            
            trackCache({method:"updateCacheItem",cacheMiss:true, key});
        }
    }

    
    module.cache_getThemesAndStories = async(reloadFromStorage=false, saveDocToStorage=false)=>{    
        return await module.getCacheItem(CACHE_THEMES_AND_STORIES, module.listAllThemesAndStories, reloadFromStorage);
    }

    module.listAllThemesAndStories = async () =>{    
        const themes = await module.listThemes();
        return await Promise.all(themes.map (async (theme)=>
        
        {theme.stories = await module.listThemeStories(theme.publicId);
            //console.log(theme.stories);
            return theme;
            }
        ));

    }

    module.cache_getThemeStories = async (publicThemeId, reloadFromStorage=false)=>
    {
        const all = await module.cache_getThemesAndStories(reloadFromStorage); 
        const theme = all.find((t)=>t.publicId==publicThemeId);
        
        if(theme!=null && theme.stories!=null)
        {
            return theme.stories;
        }
        else
        {
            return [];
        }
    }

    module.listThemeStories = async (publicThemeId)=>{
        return await storage.listObjectsFromJson(`data/${publicThemeId}/stories`);
    };

    module.cache_listThemes = async(reloadFromStorage=false)=>
    {
        return await module.cache_getThemesAndStories(reloadFromStorage);
    }

    module.listThemes = async()=>{
        return await storage.listObjectsFromJson(`data/themes`);
    }

    module.saveThemeStory = async(publicThemeId, story)=> {
        if(!story.id)
        {
            story.id = uniqid();
        }
        await storage.writeFile(`data/${publicThemeId}/stories/${story.id}.json`,JSON.stringify(story), "application/json");
        
        //update the cache
        module.updateCacheItem(CACHE_THEMES_AND_STORIES, themes=>{
            const theme = themes.find(t=>t.publicId==publicThemeId);
            if(theme!=null)
            {
                if(theme.stories)
                {
                    const reducedStories = theme.stories.filter(s=>s.id!=story.id);
                    reducedStories.push(story);
                    theme.stories = reducedStories;
                }
                else
                {
                    theme.stories = [story];
                }
            }
            //debug(theme);
            return themes;
        });

   
    };

    module.saveTheme = async(theme)=>{
        if(!theme.id)
        {
            theme.id = uniqid();
        }
        //Oops. Because of caching, turns out we are now saving story data with our themes!
        //And if our story data has a nav property, this is a circular reference to another story which cannot be stringified...
        
        if(theme.stories)
        {
            for(const story of theme.stories)
            {
                story.nav=null;
            }
        }

        await storage.writeFile(`data/themes/${theme.publicId}.json`, JSON.stringify(theme), "application/json");
        
        //update the cache
        module.updateCacheItem(CACHE_THEMES_AND_STORIES, (themes)=>{
            const reducedArray = themes.filter(t=>t.publicId!=theme.publicId);            
            reducedArray.push(theme);
            return reducedArray;
        });
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
        //debug("load uses ran");
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

    module.cache_getUsers = async(reloadFromStorage=false)=>{
        return await module.getCacheItem(CACHE_USERS, module.loadUsers, reloadFromStorage);
    }

    module.cache_getUser = async (userId)=>{
        var users=await module.cache_getUsers();        
        //debug(users);
        return users.find(u=>u.id===userId);
    }


    module.saveUsers = async (users)=>{
        await storage.writeFile('data/users.json',JSON.stringify(users), "application/json" );
        //TODO - update the cache?

    }
    // module.saveCommentDoc = async(fullDoc)=>{
    //     await storage.writeFile(`data/everything.json`, JSON.stringify(fullDoc),"application/json");
    // }

    // module.loadCommentDoc = async()=>{
    //     return await storage.readObjectFromJson(`data/everything.json`);
    // }

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

        module.setCacheItem(CACHE_COMMENTS,commentsDoc);
    }

    module.cache_getCommentsForTheme = async(publicThemeId, reloadFromStorage=false)=>
    {
        return (await module.cache_getAllComments(reloadFromStorage)).comments.filter(c=>c.themeId==publicThemeId);
    }

    module.cache_getAllComments = async(reloadFromStorage=false)=>{
        return await module.getCacheItem(CACHE_COMMENTS, module.listAllComments, reloadFromStorage);
    }

    /*
        {
            lastCommentDate:"datetime",
            comments:[]
        }
    */
    module.listAllComments = async()=>{
        let commentsDoc = null;

        try
        {
            commentsDoc = await storage.readObjectFromJson(`data/comments.json`);
        }
        catch(error)
        {            
            logger.error("listAllComments:" + error);
            return {comments:[]};
        }
        if(commentsDoc.comments)
        {
            commentsDoc.comments = commentsDoc.comments.map((comment)=>new Comment(comment));
        }
        else
        {
            commentsDoc.comments=[];
        }

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

    
    module.sortThemesByDateOldestFirst = (themes)=>{
        return themes.sort((a,b)=>{
                if(!a.deadline || !b.deadline)
                {
                    return 0;
                }
                else if(a.deadline < b.deadline)
                {
                    return -1;
                }
                else
                {
                    return 1;
                }
        });
    }


    module.groupThemesByYear = (themes)=>{
        return mapToArray(groupByIsoDate(themes,"deadline"), "year", "themes");        
    }

    module.groupStoriesByYear = (stories)=>{
        return mapToArray(groupByIsoDate(stories,"deadline"), "year", "stories");       
    }



    return module;
};
