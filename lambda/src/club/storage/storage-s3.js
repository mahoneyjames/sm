/*
    Implemenation of our tiny "data layer" that reads/writes stuff to amazon s3
*/
const aws = require("aws-sdk");
const S3 = aws.S3;
const s3 = new S3();

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


async function loadSingleS3ObjectIntoJson(path)
{    
    var response = await s3.getObject({Bucket: this.bucket, Key: this.prefix + path}).promise();
    var json = JSON.parse(response.Body.toString("utf-8"));        
    return json;
}
async function writeSingleS3Object (path, content, mimeType){
    
    await s3.putObject({
        Bucket: this.bucket,
        Key:this.prefix + path,
        Body: content, 
        ContentType: mimeType
    }).promise();    
}

async function listJsonFromS3Objects(prefix)
{
     //get a list of all objects in the author's folder
    var objects = await s3.listObjectsV2(
        {Bucket: this.bucket,
        Prefix:this.prefix + prefix}).promise();
    
    //load all the json and return it
    var storyJsonList = await Promise.all(objects["Contents"].map(async (x)=>{
        //console.log(x.Key);
        if(x.Key!=null && x.Key.slice(x.Key.length-4)=="json")
        {
            var response = await s3.getObject({Bucket: this.bucket, Key: x.Key}).promise();
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





