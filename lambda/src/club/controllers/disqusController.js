const debug = require('debug')("disqusController");
const axios = require('axios');
const moment = require('moment');
const {Comment} = require('../model/comment');


module.exports = function(accessToken, apiKey, apiSecret, forum, storageForData, storageForHtml){

    var module = {};
    module.data = require('../model/data')(storageForData);
    module.html = require('../views/html')(storageForHtml);
    module.api =require('../disqusApi')(accessToken, apiKey, apiSecret);
    module.users = null;
    module.forum = forum
    //TODO - what's the better node way of doing this type of caching? 
    
    module.get_users = async ()=>
    {
        if(module.users==null)
        {
            module.users = await module.data.loadUsers();
        }
        
        return module.users;
    }


    module.syncAllComments = async()=>
    {
        const users = await module.get_users();

        const commentDoc = {comments:[], unknownUsers:[]};

        debug("generate comment doc");

        const themes = await module.data.listThemes();
        for (theme of themes)
        {        
            debug("Theme '%'", theme.publicId);
            const stories = (await module.data.listThemeStories(theme.publicId)).map((story)=>({id:story.id,author:story.author,title:story.title,publicId:story.publicId}));
            
            for(story of stories)
            {
                debug("Story '%'", story.publicId);

                
                for(const comment of await module.api.listStoryComments(module.forum, story.id))
                {
//                    debug(JSON.stringify(comment));
                    const ourUser = users.find((u)=>u.disqusIds.find((s)=>s==comment.userId)!=null);

                    if(ourUser!=null)
                    {
                        commentDoc.comments.push(new Comment(
                            {
                                themeId: theme.publicId,
                                storyId: story.id, 
                                storyPublicId: story.publicId,
                                id: comment.id,
                                userId: ourUser.id,
                                text: comment.message,
                                when: comment.createdAt,
                                parentId: comment.parent,
                                storyTitle: story.title
                            }));
                    }
                    else
                    {
                        commentDoc.unknownUsers.push(new Comment(
                            {
                                themeId: theme.publicId,
                                storyId: story.id, 
                                storyPublicId: story.publicId,
                                id: comment.id,
                                userId: ourcomment.userId,
                                text: comment.message,
                                when: comment.createdAt,
                                parentId: comment.parent,
                                storyTitle: story.title
                            }));
                    }
                }
            }
        }

        await module.data.saveAllComments(commentDoc);
        return commentDoc;
    }

//generate a single doc containing ALL themes, stories and comments
    module.generateCommentDoc = async()=>
    {
        const commentDoc = {};

        debug("generate comment doc");

        commentDoc.themes = await module.data.listThemes();
        for (theme of commentDoc.themes)
        {        
            debug("Theme '%'", theme.publicId);
            theme.stories = (await module.data.listThemeStories(theme.publicId)).map((story)=>({id:story.id,author:story.author,title:story.title,publicId:story.publicId}));
            
            for(story of theme.stories)
            {
                debug("Story '%'", story.publicId);
                story.comments = await module.listStoryComments(story.id);
            }
        }

        await module.data.saveCommentDoc(commentDoc);
        return commentDoc;
    }

    //build a league table out of the comment doc
    module.getCommentLeagueTable = async () =>
    {
        const commentDoc = await module.data.loadCommentDoc();
        const users = await module.get_users();
        const leagueTable = {};
        const results = {totalStories:0,
            totalThemes:0,
            totalStoriesSinceDisqus:0,
            totalStoriesLastTwoMonths:0,
            users:[]};
        const momentWhenDisqusStarted = moment("2018-10-10");
        const momentTwoMonthsAgo = moment().add(-1,'M');
        const allStories = [];
                        
        for(user of users)
        {
            leagueTable[user.id] = {user:user, 
                                    totalComments:0,
                                    totalStories:0,
                                    totalStoriesSinceJoined: 0,
                                    totalStoriesSinceDisqus:0,
                                    totalStoriesLastTwoMonths:0,
                                    storiesCommentedOnSinceJoined:new Set(),                                             
                                    allStoriesCommentedOn:new Set(),
                                    storiesCommentedOnSinceDisqus:new Set(),
                                    storiesCommentOnLastTwoMonths: new Set()};
        } 

        

        for(theme of commentDoc.themes)
        {
            results.totalThemes++;
            const themeDeadline = moment(theme.deadline);



           
            

            for(story of theme.stories)
            {
                results.totalStories++;
                //add the public path to our story
                //TODO hmm - right that we have to know to do this here? but the story shouldn;t know...
                module.html.buildStoryPath(theme.publicId,story);
                allStories.push(story);
                
                for(comment of story.comments)
                {
                    if(leagueTable[comment.user]!=undefined)
                    {
                        const leagueTableUser = leagueTable[comment.user];
                        leagueTableUser.totalComments++;
                        leagueTableUser.allStoriesCommentedOn.add(story.id);
                        if(user.joined.isSameOrBefore(themeDeadline))
                        {
                            leagueTableUser.storiesCommentedOnSinceJoined.add(story.id);
                        }

                        if(themeDeadline.isSameOrAfter(momentWhenDisqusStarted))
                        {
                            leagueTableUser.storiesCommentedOnSinceDisqus.add(story.id);
                        }

                        if(themeDeadline.isSameOrAfter(momentTwoMonthsAgo))
                        {
                            
                            leagueTableUser.storiesCommentOnLastTwoMonths.add(story.id);
                        }
                    }
                }

                for (const userId in leagueTable)
                {
                    const user = leagueTable[userId];
                    if(user.id!=story.author)
                    {               
                        user.totalStories++;     
                        if(user.user.joined.isSameOrBefore(themeDeadline))
                        {
                            user.totalStoriesSinceJoined++;
                        }

                        if(themeDeadline.isSameOrAfter(momentWhenDisqusStarted))
                        {
                            user.totalStoriesSinceDisqus++;
                        }

                        if(themeDeadline.isSameOrAfter(momentTwoMonthsAgo))
                        {
                            user.totalStoriesLastTwoMonths++;
                        }
                    }                        
                }

                
            }
        }

        for (const userId in leagueTable)
        {
            
            const user = leagueTable[userId];
            const newUser = 
            {
                user: user.user,
                totalComments: user.totalComments,
                totalStoriesCommentedOn: user.allStoriesCommentedOn.size,    
                totalStoryCoveragePercentage: Math.round((user.allStoriesCommentedOn.size/user.totalStories)*100),
                totalStoriesSinceJoined: user.totalStoriesSinceJoined,
                totalStoriesCommentedOnSinceJoined: user.storiesCommentedOnSinceJoined.size,
                coverageSinceJoinedPercentage: Math.round((user.storiesCommentedOnSinceJoined.size/user.totalStoriesSinceJoined)*100),
                coverageSinceDisqusPercentage: Math.round((user.storiesCommentedOnSinceDisqus.size/user.totalStoriesSinceDisqus)*100),
                coverageLastTwoMonths: Math.round((user.storiesCommentOnLastTwoMonths.size/user.totalStoriesLastTwoMonths)*100)                 
            };

            if(user.user.joined.isAfter(momentWhenDisqusStarted))
            {
                newUser.effectiveCoverage = newUser.coverageSinceJoinedPercentage;
            }
            else
            {
                newUser.effectiveCoverage = newUser.coverageSinceDisqusPercentage;
            }

            newUser.missedStories = [];
            for(const story of allStories)
            {
                //console.log(story.author,user.user.id);
                if(story.author.toLowerCase()!=user.user.id.toLowerCase() && !user.allStoriesCommentedOn.has(story.id))
                {
                    newUser.missedStories.push(story);
                    //onsole.log(story);
                }

            }
            
            results.users.push(newUser); 
        }


        results.users =  results.users.sort((a,b)=>b.effectiveCoverage-a.effectiveCoverage);

        return results;
    }

    module.generateCommentLeagueTablePage = async()=>{
        const leagueTable = await module.getCommentLeagueTable();
        await module.html.stats_buildCommentPage(leagueTable);
    }

    return module;

}