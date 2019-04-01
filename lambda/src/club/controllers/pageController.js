const debug = require('debug')("pageController");
module.exports = function(storage)
{
    var module = {};
    
    this.htmlBuilder = require('../views/html')(storage);
    this.data = require('../model/data')(storage);
    //debug(this.data);
    this.cache = require('../model/data-cache')(this.data);

    this.buildAuthorPage = async (authorId)=>{
        authorId = authorId.toLowerCase();
        //get the user
        const user = await this.cache.getUser(authorId);
        if(user==null)
        {
            throw `User with id '${authorId} not found`;
        }

        //get all the stories
        const all = this.data.sortThemesByDateOldestFirst(await this.cache.listAllThemesAndStories());


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
                    storiesForUser.push(story);
                }
            }
        }

            //debug(storiesForUser);
        //build the page
        await this.htmlBuilder.buildUserPage(user, storiesForUser);

    };

    return this;
}