const {sanitiseId} = require('../../helpers');

module.exports = function (theme)
{
    if(theme.constructor === String)
    {
        throw "Expected an object, but was supplied with a string";
    }
    if(theme.errors==undefined)
    {
        theme.errors = [];
    }

    if(theme.themeText==undefined || theme.themeText==null || theme.themeText.trim()=="")
    {
        theme.errors[theme.errors.length] = "No theme.themeText supplied";
        return false;
    }

    if( theme.things==undefined 
        || theme.things==null 
        || theme.things.reduce((validThingCount, currentThing)=>{
        if(currentThing==null || currentThing.trim()=="")
        {

            return validThingCount;
        }
        else 
        {
            return validThingCount+1;
        }
    },0) <3)
    {
        theme.errors[theme.errors.length] = "theme.things does not have 3 entries";
    }
    
    //TODO - clean up the public theme id? or always generate it?
    if(!theme.publicId || theme.publicId.trim()=="")
    {
        theme.publicId = sanitiseId(theme.themeText);
    }

    return theme.errors.length==0;
}