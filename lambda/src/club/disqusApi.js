const debug = require('debug')("disqusApi");
const axios = require('axios');
module.exports = function(accessToken, apiKey, apiSecret){

    var module = {};

    module.listStoryComments = async(forum, storyId)=>
    {
        try
            {            
            const url = `https://disqus.com/api/3.0/threads/listPosts.json?access_token=${accessToken}&api_key=${apiKey}&api_secret=${apiSecret}&forum=${forum}&thread:ident=${storyId}`;
            debug(url);
            const response = await axios.get(url)
            //console.log(response.data.response);
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
            debug(error);
            //TODO - wrap up an exception?
            return [];
        }    
    }

    return module;
}