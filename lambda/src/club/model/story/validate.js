const debug = require('debug')("model-story-validate");
const {sanitiseId} = require('../../helpers');

module.exports = function(story)
{
    
    debug(story);
    if(!story.errors)
    {
        story.errors = [];
    }
   
    if(!story.content || story.content==null || story.content.trim()=="")
    {
        story.errors.push( "story.content has not been supplied");
    }

    if(!story.title || story.title==null || story.title.trim()=="")
    {
        story.errors.push("story.title is required");
    }

    if(!story.publicId)
    {
        story.publicId = sanitiseId(story.title);
    }
   
    debug(story);
    return story.errors.length==0;
}