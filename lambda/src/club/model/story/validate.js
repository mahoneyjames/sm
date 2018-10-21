const {sanitiseId} = require('../../helpers');

module.exports = function(story)
{
    if(!story.errors)
    {
        story.errors = [];
    }
   
    if(!story.content || story.content==null)
    {
        story.errors.push = "story.content has not been supplied";
    }

    if(!story.title || story.title==null || story.title.trim()=="")
    {
        story.errors.push("story.title is required");
    }

    if(!story.publicId)
    {
        story.publicId = sanitiseId(story.title);
    }
   
    return story.errors.length==0;
}