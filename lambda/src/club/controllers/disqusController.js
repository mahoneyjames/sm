const debug = require('debug')("disqusController");
const axios = require('axios');

module.exports = function(accessToken, apiKey, apiSecret, forum, dataLayer){

    var module = {};
    module.data = dataLayer;
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

    module.listStoryComments = async (storyId)=>
    {
        try
            {            
            const url = `https://disqus.com/api/3.0/threads/listPosts.json?access_token=${accessToken}&api_key=${apiKey}&api_secret=${apiSecret}&forum=${forum}&thread:ident=${storyId}`;
            const response = await axios.get(url)

            const users = await module.get_users();

            var comments = response.data.response.map((item)=>{
                const disqusId = item.author.username;
                const ourUser = users.find((u)=>u.disqusIds.find((s)=>s==disqusId)!=null);


                return {
                    id:item.id, 
                    createdAt: item.createdAt,                  
                    message: item.message, 
                    messageRaw:item.raw_message, 
                    parent: item.parent,
                    user: ourUser!=null ? ourUser.id : item.author.name
                }
            });
            
            return comments;
        }
        catch(error)
        {
            //console.log(error);
            //TODO - wrap up an exception?
            return [];
        }       
    }

//generate a single doc containing ALL themes, stories and comments
    module.generateCommentDoc = async()=>
    {
        const commentDoc = {};

        debug("generate comment doc");

        commentDoc.themes = await dataLayer.listThemes();
        for (theme of commentDoc.themes)
        {        
            debug("Theme '%'", theme.publicId);
            theme.stories = (await dataLayer.listThemeStories(theme.publicId)).map((story)=>({id:story.id,author:story.author,title:story.title,publicId:story.publicId}));
            
            for(story of theme.stories)
            {
                debug("Story '%'", story.publicId);
                story.comments = await module.listStoryComments(story.id);
            }
        }

        dataLayer.saveCommentDoc(commentDoc);
        return commentDoc;
    }

    //build a league table out of the comment doc
    module.getCommentLeagueTable = async () =>
    {
        const commentDoc = await dataLayer.loadCommentDoc();
        const users = await module.get_users();
        const leagueTable = {};
        for(user of users)
        {
            leagueTable[user.id] = {user:user, totalComments:0, storyIds:new Set()};
        } 

        for(theme of commentDoc.themes)
        {
            for(story of theme.stories)
            {
                for(comment of story.comments)
                {
                    if(leagueTable[comment.user]!=undefined)
                    {
                        leagueTable[comment.user].totalComments++;
                        leagueTable[comment.user].storyIds.add(story.id);
                    }
                }
            }
        }

        for (const userId in leagueTable)
        {
            const user = leagueTable[userId];
            user.totalStories = user.storyIds.size;            
        }

        return Object.keys(leagueTable).reduce((array, key)=>{
            array.push(leagueTable[key]);
            return array
                },[]).sort((a,b)=>b.totalComments-a.totalComments);

        
    }

    return module;

}