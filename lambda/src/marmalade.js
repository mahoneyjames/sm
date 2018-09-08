const pug = require('pug');
const marked = require('meta-marked');
const storyData = require('./storyData');

const markdownToHtmlConvertor = new marked.Renderer();

exports.getHelpers = (site)=>{
    var helpers = {siteName:"story marmalade"};

    if(site.toLowerCase()=="preview")
    {
        helpers.siteName = "preview:"+ helpers.siteName;        
    }

    return helpers;
}

exports.saveStory = async(site,story)=>{
    story.errors = [];
        
    if(story.content)
    {
        //if the first line of the story text contains the title, remove it
        if(story.content.slice(0, story.title.length).toLowerCase() == story.title.toLowerCase())
        {
            story.content = story.content.slice(story.title.length);
        }

        //A google drive file, so replace single new lines with double, to get the correct line breaks inserted by markdown
        if(story.format=="google")
        {
            story.content = story.content.replace(/\n/g,"\r\n\r\n");        
        }
        
        story.name = sanitisePath(story.title); 
        story.path = `stories/${story.name}`;
        
        await exports.buildAndPublishStoryHtml(site,story);        
        await storyData.saveAuthorStory(site,story);  
    }
    else
    {
        story.errors[story.errors.length] = 'story.content is empty';
    }

    return story;
}

exports.rebuildAuthorStories = async (site, author)=>{
    //Use the JSON stored on the server to rebuild the html
    var stories = await storyData.listAuthorStories(site, author);

    await Promise.all(stories.map(async (story)=>{
        console.log(story.title);
        await exports.buildAndPublishStoryHtml(site, story);
    }));
}

exports.buildAndPublishStoryHtml = async(site, story)=>
{
    html = markdownToHtml(story.content);

    var options = {story, html, helpers:exports.getHelpers(site)};
    await exports.buildPageAndUpload(site, story.path,"story", options);

    if(story.permaLinks)
    {
        story.permaLinks.map(async (link)=>{
            sanitisePath(link);
            await exports.buildPageAndUpload(site, `stories/${link}`,"story", options);    
        });
    }   
}

exports.buildAuthorIndex = async(site, author)=>{

    //list all blobs in authors/author
    //generate a page
    //write to a file author/stories    
    const stories = await storyData.listAuthorStories(site, author);    
    await buildPageAndUpload(site,`authors/${author}`,"who-list",{stories});
    return;
}

function sanitisePath  (path){
    return path.split(" ").join("-").toLowerCase();
}

exports.buildPageAndUpload = async (site, path, view, options)=>{
    options.siteRoot="";

    console.log(path);

    const fullHtml = pug.renderFile(`./views/${view}.pug`,options);    
    
    await storyData.upload(storyData.bucketNameFromSite(site), path,fullHtml, "text/html");
}

function markdownToHtml (markdown) {
    return marked(markdown, {renderer:markdownToHtmlConvertor}).html;
}