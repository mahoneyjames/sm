const s3PromiseWrapper = require('./S3PromiseWrapper');
const aws = require("aws-sdk");
const S3 = aws.S3;
const pug = require('pug');


aws.config.loadFromPath("./aws-credentials.json");
var s3 = new S3();

var s3Wrapper = new s3PromiseWrapper(s3); 
const marked = require('meta-marked');
const markdownToHtmlConvertor = new marked.Renderer();


exports.buildAndPublishStory = async(helpers, story,bucketName)=>{
    story.errors = [];

    if(story.content)
    {
        if(story.content.slice(0, story.title.length).toLowerCase() == story.title.toLowerCase())
        {
            story.content = story.content.slice(story.title.length);

        }

        if(story.format=="google")
        {
            story.content = story.content.replace(/\n/g,"\r\n\r\n");        
        }
        
        story.path = exports.sanitisePath(story.title);
        
        story.content = marked(story.content, {renderer:markdownToHtmlConvertor}).html;
        var options = {helpers, story};

        await exports.upload(bucketName, `stories/${story.path}`,"story", options);
        if(story.permaLinks)
        {
            story.permaLinks.map(async (link)=>{
                exports.sanitisePath(link);
                 await exports.upload(bucketName, `stories/${link}`,"story", options);    
            });
        }        
    }
    else{
        story.errors[story.errors.length] = 'story.content is empty';
    }

    return story;
}


exports.sanitisePath = (path)=>{
    return path.split(" ").join("-").toLowerCase();
}

exports.upload = async(bucket, path, view, options)=>{
    options.siteRoot="";
    
    const html = pug.renderFile(`./views/${view}.pug`,options);    
    await exports.put(bucket, path,html);
}

exports.put = async(bucket, path, content)=>{
    await s3Wrapper.putObject(bucket, path, content,"text/html").then(function(){console.log(`done ${path}`);}, function(reason){console.log(reason);});
}