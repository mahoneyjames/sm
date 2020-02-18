const logger = require("log2")("storage-local");
const debug =(method, path)=>logger.track("filesystem").logThing({method, path});
/*
    Implemenation of our tiny "data layer" that reads/writes stuff to the local file system
*/
const {writeFile,readFile, recurse,mkdir,ensureDir, readJson,exists} = require('fs-extra');
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

    //local storage specific stuff
    module.exists = async (path)=>{return exists(path)};

    // module.readString = async(path)
    // {
    //     return await readFile(path,"utf8");
    // };
    return module;
};

async function loadSingleFileIntoJson(path)
{
    debug("Load single", path);
    return await readJson(`${this.path}${path}`);
}
async function writeSingleFile (path, content, mimeType){
    debug("Write single", path);
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
    debug("Listing", filter);
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
        
        if(x.slice(-4)=="json")
        {
            return await readJson(x);
        }
        else
            return null;    
    }));

    return storyJsonList.filter((x)=>x!=null);

}




