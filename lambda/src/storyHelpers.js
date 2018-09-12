const pug = require('pug');
const storyData = require('./storyData');

const marked = require('meta-marked');
const markdownToHtmlConvertor = new marked.Renderer();

exports.tidyStory = (story)=>{

    //if the first line of the story text contains the title, remove it
    if(story.content!=null && story.title!=null && story.content.slice(0, story.title.length).toLowerCase() == story.title.toLowerCase())
    {
        story.content = story.content.slice(story.title.length);
    }

    //A google drive file, so replace single new lines with double, to get the correct line breaks inserted by markdown
    if(story.format=="google")
    {
        story.content = story.content.replace(/\n/g,"\r\n\r\n");        
    }

    if(story.errors==undefined)
    {
        story.errors = [];
    }
    if(story.content==null)
    {
        story.errors[story.errors.length] = "story.content has not been supplied";
    }

    return story;
}


exports.markdownToHtml =  (markdown)=> {
    return marked(markdown, {renderer:markdownToHtmlConvertor}).html;
}

exports.buildPageAndUpload = async (site, path, view, options)=>{
    options.siteRoot="";

    console.log(path);

    const fullHtml = pug.renderFile(`./views/${view}.pug`,options);    
    
    await storyData.upload(storyData.bucketNameFromSite(site), path,fullHtml, "text/html");
}