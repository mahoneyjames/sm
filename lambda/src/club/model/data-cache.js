const debug = require('debug')("data-cache");

/*
    Wrap up our data layer with a simple cache
    Maybe move this into the data class itself, and then cache everything for the lifetime of the lambda instance
    For the moment let's make it nice and clear where things are being pulled from cache
*/
module.exports = function(data){
    var module = {};

    module.data = data;

    module.cache = {};
    //debug(this);
    
    module.getUser = async (userId)=>{
        var users=await module.getCacheItem("users", module.data.loadUsers);
        debug(userId);
        return users.find(u=>u.id===userId);
    }

    module.listAllThemesAndStories = async () =>{
        return await module.getCacheItem("listAllThemesAndStories",module.data.listAllThemesAndStories);
    }


    module.getCacheItem = async (key, loader)=>
    {
        debug("getCacheItem %s", key);
        
        if(!module.cache[key])
        {
            debug("getCacheItem %s: cache miss", key);
            module.cache[key] = await loader();
        }
        //debug(module.cache);
        
        return module.cache[key];
    }

    return module;
}