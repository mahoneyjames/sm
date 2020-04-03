/*
    Implemenation of our tiny "data layer" that reads/writes stuff to amazon s3
*/
const aws = require("aws-sdk");
const S3 = aws.S3;
const s3 = new S3();
const log2 = require("log2")("storage-s3");

const debug = function(thing)
{
    log2.track("s3calls").logThing(thing);
}

module.exports =  function(options){   

    var module = {};

    if(!options.bucket)
    {
        throw "options.bucket not defined";
    }
    module.bucket = options.bucket;
    if(options.prefix)
    {
        module.prefix = options.prefix;
    }
    else
    {
        module.prefix = "";
    }
    module.writeFile = writeSingleS3Object;
    module.listObjectsFromJson = listJsonFromS3Objects;
    module.readObjectFromJson = loadSingleS3ObjectIntoJson;
    return module;
};

async function get(bucket, key)
{
    const options = {Bucket: bucket, Key: key};
    
    debug({what:"s3-get", options});
    
    return await s3.getObject(options).promise();
}

async function list(bucket, prefix)
{
    const options = {Bucket: bucket, Prefix: prefix};
    
    debug({what:"s3-list", options});
    
    const objects = await s3.listObjectsV2(options).promise();

    return objects;
}


async function loadSingleS3ObjectIntoJson(path)
{    
    
    var response = await get(this.bucket, this.prefix + path);
    //ebug(response);
    var json = JSON.parse(response.Body.toString("utf-8"));        
    return json;
}
async function writeSingleS3Object (path, content, mimeType){
    
    const options = {
        Bucket: this.bucket,
        Key:this.prefix + path,
        Body: content, 
        ContentType: mimeType
    };

    debug({what:"s3-put", options:{Bucket: options.Bucket, Key: options.Key}});

    await s3.putObject(options).promise();    
}

async function listJsonFromS3Objects(prefix)
{
     //get a list of all objects in the author's folder
    var objects = await list(this.bucket, this.prefix + prefix);
    
    //load all the json and return it
    var storyJsonList = await Promise.all(objects["Contents"].map(async (x)=>{
        //console.log(x.Key);
        if(x.Key!=null && x.Key.slice(x.Key.length-4)=="json")
        {
            var response = await  get(this.bucket, x.Key);
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





