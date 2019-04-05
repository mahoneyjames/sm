const log = require('./loggingHelper')("disqusApi");
const logFailures = require('./loggingHelper')("disqusApi-storyNotFound");
const axios = require('axios');
module.exports = function(accessToken, apiKey, apiSecret){

    var module = {};

    module.listStoryComments = async(forum, storyId)=>
    {
        const url = `https://disqus.com/api/3.0/threads/listPosts.json?access_token=${accessToken}&api_key=${apiKey}&api_secret=${apiSecret}&forum=${forum}&thread:ident=${storyId}`;
        try
            {            
            
            //log.json({dependency:"disqus", url});
            const response = await axios.get(url)
            
            var comments = response.data.response.map((item)=>{                
                return {
                    id:item.id, 
                    createdAt: item.createdAt,                  
                    message: item.message, 
                    messageRaw:item.raw_message, 
                    parent: item.parent,
                    userId: item.author.username,
                    userName: item.author.name

                }
            });
            
            return comments;
        }
        catch(error)
        {      
            //TODO - do something with this!     
            // {
            //     "code": 13,
            //     "response": "You have exceeded your hourly limit of requests"
            //   }
             
            //TODO - a more elegant approach for there being no comments for the story?
            //logFailures.json({dependency:"disqus", url, reason:"story not found? No comments for story?"});
            //TODO - wrap up an exception?
            return [];
        }    
    }

    return module;
}