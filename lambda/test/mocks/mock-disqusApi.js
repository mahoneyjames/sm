module.exports = function(sourceDataStorage){

    var module = {};
    module.step="/";

    /*
        Fake up disqus
        This loads comments from JSON files stored in some folder
        Layout is
        step/forum.json@storyId


    */

    module.listStoryComments = async(forum, storyId)=>
    {
        const comments = await sourceDataStorage.readObjectFromJson(`${module.step}${forum}.json`);
        const results = comments[storyId];
        if(results!=undefined && results!=null)
        {
            return results;
        }
        else
        {
            return [];
        }
    }

    module.setTestStep = (step)=>{

            module.step="/" + step + "/";
        
    }

    return module;
}