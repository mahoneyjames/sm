/*
    Implemenation of our tiny "data layer" that reads/writes stuff to the local file system
*/
const {writeFile,readFile, recurse,mkdir,ensureDir, readJson} = require('fs-extra');
const glob = require('glob');

module.exports =  function(options){   

    var module = {};

    if(!options.path)
    {
        throw "options.path is required";
    }

    module.path = options.path;
    module.writeFile = writeSingleFile;
    module.listObjectsFromJson = listJsonFromFiles;
    module.readObjectFromJson = loadSingleFileIntoJson;
    return module;
};

async function loadSingleFileIntoJson(path)
{
    //console.log(path);
    return await readJson(`${this.path}${path}`);
}
async function writeSingleFile (path, content, mimeType){
    //console.log(this.path);
    const extension = path.slice(-4)=="json"? "" : ".htm";
    const fullPath =`${this.path}${path}${extension}`;

    const directoryParts = fullPath.split("/");
    directoryParts.pop();   
    
    await ensureDir(directoryParts.join("/"));

    await writeFile(fullPath, content);
}

async function listJsonFromFiles(prefix)
{
    const filter =`${this.path}${prefix}/*.json`; 
    console.log(filter);
    const files = await new Promise((resolve, reject)=>{
        glob(filter,null,(err, files)=>{
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

    //load all the json and return it
    const storyJsonList = await Promise.all(files.map(async (x)=>{
        console.log(x);
        if(x.slice(-4)=="json")
        {
            return await readJson(x);
        }
        else
            return null;    
    }));

    return storyJsonList.filter((x)=>x!=null);

}




