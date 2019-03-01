const debug = require('debug')("siteController");
const generateStoryHtml = require('../model/story/buildContentHtml')

module.exports = function(storageForData,eventQueue)
{
    var module = {};

    module.queue=eventQueue;
    module.data = require('../model/data')(storageForData);

    module.saveUserData = async(users)=>

    {
        if(!users.errors)
        {
            users.errors = [];
        }

        if(!users.users)
        {
            users.errors.push("No users supplied");
            return users;
        }

        //TODO - validate the users here?
        for(const index in users.users)
        {
            
            const user = users.users[index];
            if(!user.id)
            {
                users.errors.push(`user at position '${index}' is missing an id`);
            }
            else
            {
                user.id = user.id.toLowerCase();

                if(!user.publicId)
                {
                    user.publicId = user.id;
                }
                if(!user.name)
                {
                    user.name = user.publicId;
                }

                if(user.about)
                {
                    generateStoryHtml(user.about);
                }
                if(user.disqusId)
                {
                    user.disqusIds = user.disqusId.split(",");
                }
                else
                {
                    user.disqusIds = [];
                }
            }
        }
        if(users.errors.length==0)
        {

            await module.data.saveUsers(users);

            //TODO - work out which users have changed
            //notify each user updated
            for(const user of users.users)
            {
                await module.queue.add("user-update", user);
            }
        }


        return users;
    }



    return module;
}