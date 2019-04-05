const debug = require('debug')("siteController");


module.exports = function(data, html){

    var module = {};
    module.data = data;
    module.html = html;
    
    module.rebuildHomePage=async()=>{
        const latestTheme = await module.data.getLatestTheme();
        const recentComments = (await module.data.cache_getAllComments()).comments.map((comment)=>        
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
        }).slice(0,15);
        //TODO sort descending and take 10
        //TODO work out the story path?
        await module.html.buildHomePage(latestTheme,recentComments);
    }


    module.rebuildAuthorMissingCommentsPages = async(usersIds)=>
    {
        //load the comments doc
        //load all stories
        

        const recentComments = (await module.data.cache_getAllComments());
        const allStories = module.data.sortThemesByDate((await module.data.cache_getThemesAndStories()));
        //console.log(allStories);
        const users = await module.data.cache_getUsers();
       // console.log(allStories);

        const flatStoryList = [];//allStories.reduce((outer,t)=>{t.stories.reduce((inner,s)=>inner.push(s),outer);}, []);

        for(const theme of allStories)
        {
            for(const story of theme.stories)
            {
                module.html.buildStoryPath(theme.publicId,story);
                flatStoryList.push(story);
            }
        }
       // console.log(flatStoryList);

        for(const user of users)
        {
            if(usersIds==null || usersIds.indexOf(user.id)>=0)
            {
                const allCommentsForThisUser = recentComments.comments.filter((c)=>c.userId===user.id);

    // console.log(allCommentsForThisUser);
    //             const missingStories = [];
    //             for(const story of flatStoryList)
    //             {
    //                 console.log(user.id,story.author);
    //                 if(story.author 
    //                     && story.author.toLowerCase()!=user.id.toLowerCase() 
    //                     && !allCommentsForThisUser.find(c=>c.storyId==story.id))
    //                 {
    //                     missingStories.push(story);
    //                 }
    //             }

                const themes = [];

                for(const theme of allStories)
                {
                    const innerTheme = {themeText:theme.themeText, stories:[]};

                    for(const story of theme.stories)
                    {
                        module.html.buildStoryPath(theme.publicId,story);
                        
                        if(story.author 
                            && story.author.toLowerCase()!=user.id.toLowerCase() 
                            && !allCommentsForThisUser.find(c=>c.storyId==story.id))
                        {
                            innerTheme.stories.push(story);
                        }
                    }

                    if(innerTheme.stories.length>0)
                    {
                        themes.push(innerTheme);
                    }
                }
                
                await module.html.buildUserPrivatePage(user, themes);
            }
        }
    }
    return module;
}