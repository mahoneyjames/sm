
module.exports =  function(storage){   

    var module = {};
    module.storage = storage;

    module.events = [];

    module.add = async (type, data)=>{
        console.log("add", type, data);
        module.events.push({type, data});
        module.storage.writeFile('data/events.json', JSON.stringify(module.events), 'application/json');
    };

    return module;
}