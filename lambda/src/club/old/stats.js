const moment = require('moment');
const dataForge = require('data-forge');
require('data-forge-fs');
//TODO - where should this kind of stuff live?
module.exports =  function(){   

    const module = {};

    module.arse = function(){};
    module.getAllCommentsAsArray = getAllCommentsAsArray;
    module.getStoriesAsArray = getStoriesAsArray;

    module.buildLeagueTable = (users, themesAndStoriesDoc) =>
    {
    
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

        

        for(theme of themesAndStoriesDoc.themes)
        {
            results.totalThemes++;
            const themeDeadline = moment(theme.deadline);



            
            

            for(story of theme.stories)
            {
                results.totalStories++;
                //add the public path to our story
                
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
                totalStoriesSinceDisqus: user.totalStoriesSinceDisqus,
                totalStoriesLastTwoMonths: user.totalStoriesLastTwoMonths,
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



    return module;
};

async function getStoriesAsArray(users, themesAndStoriesDoc, includeObjectReferences=false)
{

    const results = [];
    for(theme of themesAndStoriesDoc.themes)
    {
        for(story of theme.stories)
        {           
            
            results.push({
                authorId:story.author.toLowerCase(),
                publicThemeId: theme.publicId,
                storyId: story.id,
                title: story.title,               
                deadline: moment(theme.deadline).format("YYYY-MM-DD")              
            });
            
        }
    }

    const data = new dataForge.DataFrame(results);
    await data.asCSV().writeFile("./stories.csv");

    return results;
}

async function getAllCommentsAsArray(users, themesAndStoriesDoc, includeObjectReferences=false)
{

    const results = [];
    for(theme of themesAndStoriesDoc.themes)
    {
        for(story of theme.stories)
        {           
            for(comment of story.comments)
            {
                results.push({
                    authorId:story.author.toLowerCase(),
                    publicThemeId: theme.publicId,
                    storyId: story.id,
                    title: story.title,
                    commentUserId:comment.user,
                    deadline: moment(theme.deadline).format("YYYY-MM-DD")              
                });
            }
        }
    }

    const data = new dataForge.DataFrame(results);
    await data.asCSV().writeFile("./comments.csv");

    return results;
}