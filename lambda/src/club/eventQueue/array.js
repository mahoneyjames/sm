
module.exports =  function(){   

    var module = {};
    module.events = [];

    module.add = async (type, data)=>{

        module.events.push({type, data});
    };

    return module;
}