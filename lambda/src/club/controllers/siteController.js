const debug = require('debug')("siteController");
const {getRecentComments,addCommentCountsToThemes,listsUsersForCommentIds, listThemeIdsForCommentIds} = require("../model/comment/commentHelpers");
const axios = require('axios');
module.exports = function(data, html){

    var module = {};
    module.data = data;
    module.html = html;
    
    module.notifyOtherLambdaAboutNewComments = async(comments, newCommentIds)=>{
        //do a http post against the other instance, passing over the daa
        //That version happens to be running this siteController too, and it calls refreshBasedOnNewComments(comments, newCommentIds)
        const remoteUrl = process.env.URL_NOTIFY_NEW_COMMENTS;
        if(remoteUrl!=null && remoteUrl.trim)
        {
            debug("Notifying '%s' about new comments", remoteUrl);
            return await axios.post(remoteUrl, {comments, newCommentIds});
        }
        else
        {
            debug("No remote site configured using environment variable 'URL_NOTIFY_NEW_COMMENTS' to notify about new comments");
        }
    }
    module.refreshBasedOnNewComments = async (comments, newCommentIds)=>{
        if(newCommentIds.length>0)
        {    
            //Only update the user's page if this is a comment we haven't seen before
            await module.rebuildAuthorMissingCommentsPages(listsUsersForCommentIds({comments}, newCommentIds));    
        }
    }

    module.rebuildHomePage=async()=>{
        const latestTheme = await module.data.getLatestTheme();
        const allComments = await module.data.cache_getAllComments();
        const recentComments = getRecentComments(allComments.comments,15)
                                .map(comment=>{
                                        comment.story = {publicId: comment.storyPublicId,
                                                        title: comment.storyTitle};
                                        module.html.buildStoryPath(comment.themeId, comment.story);
                                        return comment;
                                    });

        const recentThemes = await module.data.sortThemesByDate((await module.data.cache_getThemesAndStories())).slice(1,4); //get the 3 most recent...
        
        
        addCommentCountsToThemes(recentThemes,allComments.comments);

        console.log(recentThemes);

        await module.html.buildHomePage(latestTheme,recentComments,recentThemes);
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
            if(theme.stories)
            {
                for(const story of theme.stories)
                {
                    module.html.buildStoryPath(theme.publicId,story);
                    flatStoryList.push(story);
                }
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