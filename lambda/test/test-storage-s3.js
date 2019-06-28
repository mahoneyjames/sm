const expect = require('chai').expect;
const debug = require('debug')("test-storage-s3");
const moment = require('moment');

require('dotenv').config({ path: 'variables.env' });

describe("storage-s3", function(){


    const bucket = "unittest.storyclub.co.uk";
    const prefix = "test-storage-1/" + moment().format("YYYY-MM-DDTHH-mm-ss/");
    
    debug("Writing data to '%s' in bucket '%'", prefix, bucket);

    const storage = require("../src/club/storage/storage-s3")({bucket, prefix});
    

    it("put-1",async function(){
        await storage.writeFile("1.json", JSON.stringify({file:"one"}), "application/json");
    });
    it("get-1",async function(){
        const thing = await storage.readObjectFromJson("1.json");
        debug(thing);
        expect(thing.file).to.equal("one");
    });

    it("put-2", async function(){
        await storage.writeFile("2.json", JSON.stringify({file:"two"}), "application/json");
    });
    it("get-2", async function(){
        const thing = await storage.readObjectFromJson("2.json");
        debug(thing);
        expect(thing.file).to.equal("two");
    });

    
    it("put-1a", async function(){
        await storage.writeFile("1a.json", JSON.stringify({file:"onea"}), "application/json");
    });
    it("get-1a", async function(){
        const thing = await storage.readObjectFromJson("1a.json");
        debug(thing);
        expect(thing.file).to.equal("onea");
    });

    it("list", async function(){
        const things = await storage.listObjectsFromJson("1");
        expect(things.length).to.equal(2);
        expect(things[0].file).to.equal("one");
        expect(things[1].file).to.equal("onea");

    })

});
