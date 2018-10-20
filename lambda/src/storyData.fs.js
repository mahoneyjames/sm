 //const {promisify} = require('util');
// const glob = promisify(require('glob'));
const {writeFile,readFile, recurse,mkdir,ensureDir, readJson} = require('fs-extra');
//const readAFileReturnPromise = promisify(readFile);
//const mkdirPromise = promisify(mkdir);
const glob = require('glob');




exports.upload = async (bucket, path, content, mimeType)=>{
    const extension = path.slice(-4)=="json"? "" : ".htm";        
    await writeFile(`${bucket}/${path}${extension}`, content);
}

exports.bucketNameFromSite = (site) => {
    switch(site.toLowerCase())
    {
        case "preview":
            return "_site/preview";
        case "prod":        
            return "_site/prod";
        case "storyclub":
            return "_site/club";
        default:
            throw `'${site}' did not map to an S3 buket'`;
    }
}

exports.saveStoryClubStory = async(site, story)=>
{
    const bucketName = exports.bucketNameFromSite(site);
    console.log(story.path);
    await ensureDir(`${bucketName}/${story.path}`);
    await exports.upload(bucketName,`${story.path}/sdlksdaljkdsfaljkdfsljk.json`,JSON.stringify(story), "application/json");
}

exports.listStoryClubThemeStories = async (site,prefix,themeId)=>{

    const bucketName = exports.bucketNameFromSite(site);

    //get a list of all objects in the author's folder
    
    const files = await new Promise((resolve, reject)=>{
        glob(`${bucketName}/${prefix}${themeId}/*/sdlksdaljkdsfaljkdfsljk.json`,null,(err, files)=>{
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(files);
            }
        });
    });
//    console.log(files);
    
    
    //load all the json and return it
    const storyJsonList = await Promise.all(files.map(async (x)=>{
        console.log(x);
        return await readJson(x);
    }));

console.log(storyJsonList);
    return storyJsonList.filter((x)=>x!=null);
}