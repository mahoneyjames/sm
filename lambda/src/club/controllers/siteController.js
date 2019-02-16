const debug = require('debug')("siteController");


module.exports = function(storageForData, storageForHtml){

    var module = {};
    module.data = require('../model/data')(storageForData);
    module.html = require('../views/html')(storageForHtml);
    
    module.users = null;
    //TODO - what's the better node way of doing this type of caching? 
    
    module.get_users = async ()=>
    {
        if(module.users==null)
        {
            module.users = await module.data.loadUsers();
        }
        
        return module.users;
    }

    module.rebuildHomePage=async()=>{
        const latestTheme = await module.data.getLatestTheme();
        const recentComments = (await module.data.listAllComments()).comments.map((comment)=>        
        {
            comment.story = {publicId: comment.storyPublicId,
                            title: comment.storyTitle};
            module.html.buildStoryPath(comment.themeId, comment.story);
            return comment;
        }).sort((a,b)=>{
                if(!a.when || !b.when)
                {
                    return 0;
                }
                else if(a.when > b.when)
                {
                    return -1;
                }
                else
                {
                    return 1;
                }
        }).slice(0,10);
        //TODO sort descending and take 10
        //TODO work out the story path?
        await module.html.buildHomePage(latestTheme,recentComments);
    }
    return module;
}