const debug = require('debug')("event-html");
module.exports =  function(storageForData, storageForHtml){   

    var module = {};
    module.data = storageForData;
    modulehtml = storageForHtml;

    module.events = [];

    module.controller = require('../controllers/pageController')(storageForHtml);                
    module.add = async (type, data)=>{
        debug("add", type, data);
        module.events.push({type, data});

        if(type==="user-update")
        {                        
            
            await module.controller.buildAuthorPage(data.id);
                
        }
    };

    return module;
}