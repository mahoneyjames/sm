const debug = require('debug')("pageController");
module.exports = function(storage)
{
    var module = {};
    
    this.htmlBuilder = require('../views/html')(storage);
    this.data = require('../model/data')(storage);
    

    this.buildAuthorPage = async (authorId)=>{
        authorId = authorId.toLowerCase();
        //get the user
        const user = await this.data.cache_getUser(authorId);
        if(user==null)
        {
            throw `User with id '${authorId} not found`;
        }

        //get all the stories
        const all = this.data.sortThemesByDateOldestFirst(await this.data.cache_getThemesAndStories());


        //work out only the stories for this user
        //TODO - seems as though this is some logic that should live elsewhere. In data or data-cache?
        const storiesForUser = [];
        
        
        for (const theme of all)
        {
            for(const story of theme.stories)
            {
                debug(story.author);
                if(story.author.toLowerCase()==authorId)
                {
                    story.themeId = theme.publicId;
                    story.deadline = theme.deadline;
                    storiesForUser.push(story);
                }
            }
        }


            //debug(storiesForUser);
        //build the page
        //debug(this.data.groupStoriesByYear(storiesForUser));
        await this.htmlBuilder.buildUserPage(user,storiesForUser, this.data.groupStoriesByYear(storiesForUser));

    };

    return this;
}