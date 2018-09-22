const aws = require("aws-sdk");
const S3 = aws.S3;
//aws.config.loadFromPath('./aws-credentials.json');
const s3 = new S3();


exports.listAuthorStories = async (site,authorName)=>{

    const bucketName = exports.bucketNameFromSite(site);

    //get a list of all objects in the author's folder
    var objects = await s3.listObjectsV2(
        {Bucket: bucketName,
        Prefix:`authors/${authorName}/`}).promise();
    
    //load all the json and return it
    var storyJsonList = await Promise.all(objects["Contents"].map(async (x)=>{
        console.log(x.Key);
        var response = await s3.getObject({Bucket: bucketName, Key: x.Key}).promise();
        var json = JSON.parse(response.Body.toString("utf-8"));        
        return json;
    }));

    return storyJsonList;
}

exports.saveAuthorStory = async(site, story)=>
{
    const bucketName = exports.bucketNameFromSite(site);
    await exports.upload(bucketName,`authors/${story.author}/${story.name}.json`,JSON.stringify(story), "application/json");
}

exports.saveAuthor = async(site,author)=>{
    const bucketName = exports.bucketNameFromSite(site);
    await exports.upload(bucketName,`authors/${author.id}.json`,JSON.stringify(author), "application/json");
}
exports.upload = async (bucket, path, content, mimeType)=>{

    await s3.putObject({
        Bucket: bucket,
        Key:path,
        Body: content, 
        ContentType: mimeType
    }).promise();    
}

exports.bucketNameFromSite = (site) => {
    switch(site.toLowerCase())
    {
        case "preview":
            return "preview.storymarmalade.co.uk";
        case "prod":        
            return "www.storymarmalade.co.uk";
        case "storyclub":
            return "www.storyclub.co.uk";
        default:
            throw `'${site}' did not map to an S3 buket'`;
    }
}

exports.saveStoryClubStory = async(site, story)=>
{
    const bucketName = exports.bucketNameFromSite(site);
    await exports.upload(bucketName,`${story.path}/sdlksdaljkdsfaljkdfsljk.json`,JSON.stringify(story), "application/json");
}

exports.listStoryClubThemeStories = async (site,prefix,themeId)=>{

    const bucketName = exports.bucketNameFromSite(site);

    //get a list of all objects in the author's folder
    var objects = await s3.listObjectsV2(
        {Bucket: bucketName,
        Prefix:`${prefix}${themeId}/`}).promise();
    
    //load all the json and return it
    var storyJsonList = await Promise.all(objects["Contents"].map(async (x)=>{
        console.log(x.Key);
        if(x.Key!=null && x.Key.slice(x.Key.length-4)=="json")
        {
            var response = await s3.getObject({Bucket: bucketName, Key: x.Key}).promise();
            var json = JSON.parse(response.Body.toString("utf-8"));        
            return json;
        }
        else
        {
            return null;
        }
    }));

    return storyJsonList.filter((x)=>x!=null);
}