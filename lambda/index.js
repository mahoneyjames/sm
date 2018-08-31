const s3PromiseWrapper = require('./src/S3PromiseWrapper');
const aws = require("aws-sdk");
const S3 = aws.S3;
const pug = require('pug');

    console.log("haro");

aws.config.loadFromPath("./aws-credentials.json");
const bucketName = "preview.storymarmalade.co.uk";
var s3 = new S3();

var s3Wrapper = new s3PromiseWrapper(s3); 



var stories = [{"title":"All at badger",
                "author":"JamesM",
                "content":"There once was a lovely little sausage named Baldrick"},
                {"title":"Doggy style","author":"JennyA","content":"Paint me like your french girls"},
                {"title":"Death and mutilation","author":"LewisG","content":"Where is my mind?"}];



var helpers = {siteName:"PREVIEW: Story Marmalade"};

for(var index in stories)
{
    let story = stories[index]

    if(!story.path)
    {
        story.path = sanitisePath(story.title);
    }
    var options = {helpers, story};

    upload(bucketName, `stories/${story.path}`,"story", options);
    
}

upload(bucketName,"index", "storyList", {helpers,stories});
upload(bucketName,"about", "about", {helpers});

upload(bucketName, "pobol/JamesM", "who", {helpers, author:{name:"James", about:"Yay!"}});
upload(bucketName, "pobol/JennyA", "who", {helpers, author:{name:"Jenny", about:"Always not dissapointing!"}});
upload(bucketName, "pobol/LewisG", "who", {helpers, author:{name:"Lewis", about:"Not a good sepller"}});
upload(bucketName,"oops", "oops", {helpers});
    



function sanitisePath(path)
{
    return path.split(" ").join("-").toLowerCase();
}

function upload(bucket, path, view, options)
{
    options.siteRoot="";
    
    const html = pug.renderFile(`../build/views/${view}.pug`,options);    
    put(bucket, path,html);
}

function put(bucket, path, content)
{
    s3Wrapper.putObject(bucket, path, content,"text/html").then(function(){console.log(`done ${path}`);}, function(reason){console.log(reason);});
}