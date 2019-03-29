const debug = require('debug')("event-html");
module.exports =  function(storageForData, storageForHtml){   

    var module = {};
    module.data = storageForData;
    modulehtml = storageForHtml;

    module.events = [];

    module.add = async (type, data)=>{
        debug("add", type, data);
        module.events.push({type, data});

        if(type==="user-update")
        {            
            
                const controller = require('../views/html')(storageForHtml);
                
                await controller.buildUserPage(data);
                
        }
    };

    return module;
}