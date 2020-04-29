const {groupStoriesByAuthor} = require("../model/data-helpers");
module.exports = function(storage, viewHome)
{
    var module = {};
    
    this.htmlBuilder = require('storyclub-views')(storage, viewHome);
    this.data = require('../model/data')(storage);
    
    this.buildAuthorsPage = async()=>{
        const users = await this.data.cache_getUsers();
        const all = await this.data.cache_getThemesAndStories();
        const storiesByUser = groupStoriesByAuthor(all);
        const oneHitWonders = [];
        const stars = [];
        for(const user of users)
        {
            const userId = user.id.toLowerCase();
            
            if(storiesByUser[userId]==undefined || storiesByUser[userId].stories.length<2)
            {
                oneHitWonders.push(user);
            }
            else
            {
                stars.push(user);
            }
            
        }

        await this.htmlBuilder.buildAuthorsPage(users, stars, oneHitWonders);
    }

    this.buildAuthorPage = async (authorId)=>{
        authorId = authorId.toLowerCase();
        //get the user
        const user = await this.data.cache_getUser(authorId);
        if(user==null)
        {
            throw `User with id '${authorId} not found`;
        }

        //get all the stories
        const all = this.data.sortThemesByDate(await this.data.cache_getThemesAndStories());


        //work out only the stories for this user
        //TODO - seems as though this is some logic that should live elsewhere. In data or data-cache?
        const storiesForUser = [];
        
        
        for (const theme of all)
        {
            if(theme.stories)
            {
                for(const story of theme.stories)
                {
                    //debug(story.author);
                    if(story.author.toLowerCase()==authorId)
                    {
                        story.themeId = theme.publicId;
                        story.deadline = theme.deadline;
                        storiesForUser.push(story);
                    }
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