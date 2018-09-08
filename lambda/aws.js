const aws = require("aws-sdk");
const S3 = aws.S3;
aws.config.loadFromPath("./aws-credentials.json");

//aws.config.
var s3 = new S3();

async function list()
{
    var objects = await s3.listObjectsV2({Bucket: "preview.storymarmalade.co.uk"
,Prefix:"authors/JamesM/"}).promise();
    
    //console.log();
//  await objects["Contents"].forEach(async (object)=>{
//         console.log(object.Key);
//         var response = await s3.getObject({Bucket: "preview.storymarmalade.co.uk", Key: object.Key}).promise();

//         var json = JSON.parse(response.Body.toString("utf-8"));
//         console.log(json.title);
    
// });

var json = await Promise.all(objects["Contents"].map(async (x)=>{

console.log(x.Key);
        var response = await s3.getObject({Bucket: "preview.storymarmalade.co.uk", Key: x.Key}).promise();

        var json = JSON.parse(response.Body.toString("utf-8"));
        
        return json;
}));

console.log(json.length);
    // for(var thing in objects["Contents"])
    // {
    //     console.log(thing);
    // }
    //console.log("1-" + objects);
    return objects;
}

list();
//list().then((data)=>console.log(data));
