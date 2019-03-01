const marked = require('meta-marked');
const markdownToHtmlConvertor = new marked.Renderer();

module.exports = function(story)
{
    if (story.format=="google")
    {
        story.content = story.content.replace(/\n/g,"\r\n\r\n");        
    }
    if(story.content!=null)
    {
        story.html = marked(story.content, {renderer:markdownToHtmlConvertor}).html;
    }
    else
    {
        story.html = "";
    }
}
