const {groupBy,groupByResultToObjectWithArrays} = require("../helpers")

module.exports.groupStoriesByAuthor = (themesAndStories)=>{
    return groupByResultToObjectWithArrays(groupBy(module.exports.themesAndStoriesArrayToStoriesArray(themesAndStories),
                    s=>s.author.toLowerCase()),"stories");
}

module.exports.themesAndStoriesArrayToStoriesArray = (themesAndStories)=>{
    const stories = [];

    for (const theme of themesAndStories)
    {
        if(theme.stories)
        {
            for(const story of theme.stories)
            {
                stories.push(story);                
            }
        }
    }

    return stories;
}

