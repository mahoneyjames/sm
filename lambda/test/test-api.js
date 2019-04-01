var expect = require('chai').expect;
const debug = require('debug')("test-api");

const axios = require('axios');

const urlRoot="http://localhost:34333";
const browseSiteRoot="http://localhost:9999";


describe("local-api: brand new site", function(){
    
    //TODO - clear up data first. 
    //TODO - filter this out of the standard test run?
    //TODO option to run this by itself via package.json?

        var storage = require('../src/club/storage/storage-local.js')({path:"test/inputs/api-test-1/"});
        
        it("check target", async function(){
            expect(await get('/hello')).to.equal("hello world:localstorage");
        });
        it("static pages", async function(){
            debug(await get ("/api/site/refreshStaticPages"));

        });

        it("save users",async function(){
            const userResult = await post('/api/users/save',await storage.readObjectFromJson("users.json"));
            expect(userResult.errors.length).to.equal(0);
        });

        it("save theme 1", async function(){
            const theme1 = await post('/api/themes/save', {
                "theme":
                {
                    "themeText":"theme 1",
                    "things":["1","2","3"],
                    "deadline":"2019-01-10"
                }
            });
            expect(theme1.errors.length).to.equal(0);
            expect(theme1.publicId).to.equal("theme-1");
        });

        it("save theme 2", async function(){
            const theme2 = await post('/api/themes/save', {
                "theme":
                {
                    "themeText":"theme 2",
                    "things":["5","6","7"],
                    "deadline":"2018-01-10",
                    "publicId":""
                }
            },false);
            //debug(theme2);
            expect(theme2.errors.length).to.equal(0);
            expect(theme2.publicId).to.equal("theme-2");
        });

        it("save theme 3", async function(){
            const theme2 = await post('/api/themes/save', {
                "theme":
                {
                    "themeText":"theme 3",
                    "things":["5","6","7"],
                    "deadline":"2017-01-10",
                    "publicId":""
                }
            },false);
            //debug(theme2);
            expect(theme2.errors.length).to.equal(0);
            expect(theme2.publicId).to.equal("theme-3");
        });

        it("set latest", async function(){
            expect(await post('/api/themes/setLatest',{
                "publicThemeId": "theme-1"    
            },false )).to.not.be.null;
        });

        it("rebuild themes pages", async function(){
            expect(await get("/api/site/refreshThemeList")).to.equal("done");
        });

        it("rebuild home",async function(){
            expect(await get("/api/site/home")).to.equal("doned");
        });

        it("theme1-story1",async function(){
            const result = await post("/api/stories/save", await storage.readObjectFromJson("theme-1/story-1.json"));
            //debug(result);
            expect(result.publicId).to.equal("steps-in-the-darkness");
            expect(result.path).to.equal('h/theme-1/steps-in-the-darkness');

        });

        
        it("theme1-story2",async function(){
            const result = await post("/api/stories/save", await storage.readObjectFromJson("theme-1/story-2.json"));
            //debug(result);
            expect(result.publicId).to.equal("boots");
            expect(result.path).to.equal('h/theme-1/boots');

        });

        it("theme1-story2-no-content", async function(){
            const result = await post("/api/stories/save", {publicThemeId:"theme-1", story:{title:"st#ory 3?"}});
            debug(result);
            expect(result.errors.length).to.equal(1);
            //expected(storage.exists())
        });
        
        it("theme2-story-liz",async function(){
            const result = await post("/api/stories/save", await storage.readObjectFromJson("theme-2/liz.json"));
            //debug(result);
            expect(result.id).to.equal("nd21jm0g26cw");
            expect(result.publicId).to.equal("newbeginnings");
            expect(result.path).to.equal('h/theme-2/newbeginnings');

        });

        
        it("theme2-story-hannah",async function(){
            const result = await post("/api/stories/save", await storage.readObjectFromJson("theme-2/hannah.json"));
            //debug(result);
            expect(result.id).to.equal("nd21jm0g281z");
            expect(result.publicId).to.equal("oreo");
            expect(result.path).to.equal('h/theme-2/oreo');

        });

                
        it("theme2-story-james",async function(){
            const result = await post("/api/stories/save", await storage.readObjectFromJson("theme-2/james.json"));
            //debug(result);
            expect(result.id).to.equal("xxxxx");
            expect(result.publicId).to.equal("boddle");
            expect(result.path).to.equal('h/theme-2/boddle');

        });

        it("bulk load some stories",async function(){
            await post("/api/stories/save", await storage.readObjectFromJson("theme-3/liz.json"));
            await post("/api/stories/save", await storage.readObjectFromJson("theme-3/james.json"));
            await post("/api/stories/save", await storage.readObjectFromJson("theme-3/hannah.json"));

        });

        

        it("publish theme 1", async function(){
            const result = await post("/api/site/publishThemeForReview",{publicThemeId:"theme-1"});
            //debug(result);
            expect(result).to.equal("done");
        });


        it("publish theme 2", async function(){
            const result = await post("/api/site/publishThemeForReview",{publicThemeId:"theme-2"});
            //debug(result);
            expect(result).to.equal("done");
        });


        it("reveal theme 1 authors", async function(){
            const result = await post("/api/site/closeTheme",{publicThemeId:"theme-1"});
            //debug(result);
            expect(result).to.equal("done");

        });

        it.skip("grab a list of all themes and stories", async function(){
            const result = await get("/api/themes/listEverything");

            //debug(result);
            const theme1 = result.find(t=>t.publicId=="theme-1");
            expect(theme1.status).to.equal("complete");
            expect(theme1.stories.length).to.equal(2);

        });

        it("save users again (to force a rebuild of user pages)",async function(){
            const userResult = await post('/api/users/save',await storage.readObjectFromJson("users.json"));
            expect(userResult.errors.length).to.equal(0);
        });
        

    

});

async function get(url)
{
    try
    {    
        return (await axios.get(`${urlRoot}${url}`)).data;
    }
    catch(error)
    {
        debug(url,":", error);
        throw error;
    }
}

async function post(url, data, printOutput)
{
    try
    {       
        const result = (await axios.post(`${urlRoot}${url}`,data)).data;
        if(printOutput)
        {
            debug(typeof result);
            debug(result);
        }
        return result;
    }
    catch(error)
    {
        debug(url,":", error);
        throw error;
    }        
}