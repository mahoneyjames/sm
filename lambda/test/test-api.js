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
        var storageForSite = require("../src/club/storage/storage-local")({path:"_site/club/data/"});
        
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
            expect(result.status).to.equal("success");
            expect(result.theme.stories.length).to.equal(2);
        });

        it("publish theme 2", async function(){
            const result = await post("/api/site/publishThemeForReview",{publicThemeId:"theme-2"});
            //debug(result);
            expect(result.status).to.equal("success");
            expect(result.theme.stories.length).to.equal(3);
        });



        it("reveal theme 1 authors", async function(){
            const result = await post("/api/site/closeTheme",{publicThemeId:"theme-1"});
            debug(result);
            expect(result.status).to.equal("success");
            expect(result.theme.stories.length).to.equal(2);

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
        
        it("test comments",async function(){
            await storageForSite.writeFile("comments.json",JSON.stringify(            
                {
                    "comments": [{
                        "themeId": "theme-1",
                        "storyId": "1c9lz1jr8uqla5",
                        "storyPublicId": "steps-in-the-darkness",
                        "storyTitle": "A warm welcome",
                        "id": "4348071872",
                        "userId": "lewis",
                        "text": "<p>In-laws hey! I was expecting a bit more of a twist for this one. But it was well written and characters were quite honest. I was jus hoping for something extra at the end.</p>",
                        "when": "2019-02-21T16:48:53",
                        "parentId": null
                    },
                    {
                        "themeId": "theme-1",
                        "storyId": "1c9lz1jr8uqla5",
                        "storyPublicId": "steps-in-the-darkness",
                        "storyTitle": "A warm welcome",
                        "id": "4309947690",
                        "userId": "hannah",
                        "text": "<p>Love the dynamic here it feels very real. The characters are well developed given the brevity. James’ Mum particularly from the first twitch of the curtain up to the victorious smirk!</p>",
                        "when": "2019-01-27T20:50:28",
                        "parentId": null
                    },
                    {
                        "themeId": "theme-1",
                        "storyId": "1ki2m1jqi7k9w6",
                        "storyPublicId": "boots",
                        "storyTitle": "Best before",
                        "id": "4290295795",
                        "userId": "hannah",
                        "text": "<p>Oh I loved this! They remind me of the couple who ran the post office on Crwys road (now an artisan micro-beer pub). The guardian of the curly ended sandwich line was inspired. Liz?</p>",
                        "when": "2019-01-17T12:58:54",
                        "parentId": null
                    },
                    {
                        "themeId": "theme-1",
                        "storyId": "1ki2m1jqi7k9w6",
                        "storyPublicId": "boots",
                        "storyTitle": "Best before",
                        "id": "2988234343",
                        "userId": "james",
                        "text": "<p>Nested comment!</p>",
                        "when": "2019-01-17T12:58:54",
                        "parentId": 4290295795
                    },
                    {
                        "themeId": "theme-1",
                        "storyId": "1ki2m1jqi7k9w6",
                        "storyPublicId": "boots",
                        "storyTitle": "Best before",
                        "id": "29882343443",
                        "userId": "james",
                        "text": "<p>aNOTHER COMMENT</p>",
                        "when": "2019-01-17T12:58:54",
                        "parentId": null
                    },                    
                    {
                        "themeId": "theme-2",
                        "storyId": "1ki2m1jqi7sdfk9w6",
                        "storyPublicId": "boots",
                        "storyTitle": "Best before",
                        "id": "2988234343",
                        "userId": "james",
                        "text": "<p>OOh, yeah!</p>",
                        "when": "2019-01-17T12:58:54",
                        "parentId": null
                    }
                ]
            }));

            await get("/api/cache/reset");
            const result = await post("/api/site/rebuildTheme", {publicThemeId:"theme-1"});
            const result2 = await post("/api/site/rebuildTheme", {publicThemeId:"theme-2"});


            expect(await get("/api/site/refreshThemeList")).to.equal("done");

        });

        it("comment-counts-theme", async function()
        {
            
            console.log(await get("/ajax/comments/counts/forThemesByThemes?jsonThemeIdArray=%5B%22theme-1%22%2C%22theme-2%22%2C%22theme-3%22%5D"));
        })

    
        it("comment-counts-for-stories", async function()
        {
            const results = await get("/ajax/comments/counts/forStoriesByTheme/theme-1");
            console.log(results.themes['theme-1'].stories);
            expect(results.themes['theme-1'].stories.boots.total).to.equal(3);
        })

        it("comment-recent", async function(){
            const results = await get ("/ajax/comments/recent");
            console.log(results);
        })

        it("comments-reset", async function(){
            await post("/api/kldjfklasdjfkladfjkldjfdasf/comments/notifyUpdates");
        })

});

describe.skip("local-api-real-data", async function(){
    await loadDataToSiteViaApi(require('../src/club/storage/storage-local.js')({path:"test/inputs/api-test-3/"}));    
    
});

describe.skip("local-api-build-site", function(){

    it.skip("do it all", async function()
    {
        debug(await get ("/api/site/refreshStaticPages"));
        //TODO - something to rebuild the user pages without updating the users?
        expect(await get("/api/site/refreshThemeList")).to.equal("done");
        expect(await get("/api/site/no-comments")).to.equal("doned");
    });

    it("adhoc", async function()
    {
        const result = await post("/api/site/rebuildTheme", {publicThemeId:"the-attic"});
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
        //debug(data);
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

async function loadDataToSiteViaApi(storage)
{
    it("load users", async function(){
        await post('/api/users/save',await storage.readObjectFromJson("users.json"));
    });

    const themeIds = [];
    describe("load themes", function(){
        let allThemes = null;
        before(async function()
        {
            allThemes = await storage.listObjectsFromJson("themes");
        });
        it("load themes", async function(){
            this.timeout(40000);
            for(const theme of allThemes)
            {
                if(theme.constuctor==String)
                {
                    console.log("Duff theme object - a string return instead of json '%s'", theme);
                }
                if(theme!=undefined && theme.constructor!=String)
                {
                    //debug(theme);
                    //TODO - bug in our lister, so it's returning something duff?
                    //The string "a-fresh-start" is appearing from somewhere - are we returning the path by mistake as well?
                    debug("load theme: " + theme.publicId);                    
                    const importedTheme = await post('/api/themes/save', {theme},false);
                    allThemes.push(importedTheme.publicId);

                    const storiesForThemes = await storage.listObjectsFromJson(`${theme.publicId}/stories`);
                    for(const story of storiesForThemes)
                    {
                        if(story!=undefined)
                        {
                            if(story.publicId.indexOf("*")<0)
                            {
                                debug("load story '%s'", story.title);
                                await post("/api/stories/save", {publicThemeId: importedTheme.publicId, story});
                            }
                            else
                            {
                                debug("Skipping story '%s' because its id contains unsupported characters", story.title);
                            }
                        }
                    }

                    await post("/api/site/closeTheme",{publicThemeId: importedTheme.publicId});

                }
            }
        });
    });

    it("build site page", async function(){
        expect(await get("/api/site/refreshThemeList")).to.equal("done");
    });

    it("save users to trigger author page build", async function(){
        await post('/api/users/save',await storage.readObjectFromJson("users.json"));
    });
}