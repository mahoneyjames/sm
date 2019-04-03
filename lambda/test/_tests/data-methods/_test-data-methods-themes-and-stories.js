const debug = require('debug')("test-data-methods");
var expect = require('chai').expect;
module.exports = async function(storageLoader){   

    var module = {};

    let data = null;
    let storage = null;
    
    before(async function(){
        storage = await storageLoader();
        data = require('../../../src/club/model/data')(storage);
        
    });

/*
[x] list themes and stories
[x] get themes and stories
[x] list themes
[x] list theme stories
[x] update theme in cache
[x] update story in cache
*/
    it("list-themes-and-stories", async function(){
        const all = await data.listAllThemesAndStories();

        expect(all.length).to.equal(2);
        expect(all[0].themeText).to.equal("theme1");

    })

    it("get-themes-and-stories-cache-miss", async function(){
        //save a new theme. we should get it, before the first load did not 
        //use the cache
        await saveTheme({themeText:"theme3", publicId:"theme3"});
        const all = await data.cache_getThemesAndStories();
        expect(all.length).to.equal(3);
    });

    it("get-themes-and-stories-cache-hit", async function(){
        //save a new theme. because we do not reload the cache, we don't get it 
        await saveTheme({themeText:"theme4", publicId:"theme4"});
        const all = await data.cache_getThemesAndStories();
        expect(all.length).to.equal(3);
    });

    it("get-themes-and-stories-cache-hit-reload-is-true", async function(){
        //now ask that the cache is reloaded. we should get that theme4
        const all = await data.cache_getThemesAndStories(true);
        expect(all.length).to.equal(4);
    });

    it("list-themes", async function(){
        //add yet another new theme. because this is non-cached, we'll get it!
        await saveTheme({themeText:"theme5", publicId:"theme5"});
        const themes = await data.listThemes();
        expect(themes.length).to.equal(5);
    });

    
    it("get-themes", async function(){
        //add yet another new theme. because this *is* cached, we don't see it
        await saveTheme({themeText:"theme6", publicId:"theme6"});
        const themes = await data.cache_listThemes();
        expect(themes.length).to.equal(4);
    });

    it("list-theme-stories",async function(){
        await saveThemeStory("theme1",{id:"one"});
        await saveThemeStory("theme1",{id:"two"});
        const stories = await data.listThemeStories("theme1");
        expect(stories.length).to.equal(2);
        expect(stories[0].id).to.equal("one");
    });

    it("get-theme-stories-cache",async function (){
        const stories= await data.cache_getThemeStories("theme1");
        //because we are reading from cache, there be no stories!
        expect(stories.length).to.equal(0);
    });

    it("get-theme-stories-cache-reload-is-true",async function (){
        const stories= await data.cache_getThemeStories("theme1",true);
        //reload is true, so we should see the stories
        expect(stories.length).to.equal(2);
        expect(stories[0].id).to.equal("one");
    });

    it("cache-save-new-theme", async function(){
        await data.saveTheme({themeText:"theme7", publicId:"theme7"});
        const themes = await data.cache_listThemes();

        //we should see our new theme, even though we have not requested to reload the cache, since our class updates it
        expect(themes.length).to.equal(7);
    });

    it("cache-update-existing-theme", async function(){
        await data.saveTheme({themeText:"theme7", publicId:"theme7",value:"changed"});
        const themes = await data.cache_listThemes();

        //we should see our new theme, even though we have not requested to reload the cache, since our class updates it
        expect(themes.length).to.equal(7);
        expect(themes[6].value).to.equal("changed");
    });

    it("cache-save-new-story", async function(){
        await data.saveThemeStory("theme1", {title:"story 3",id:"3"});
        const stories= await data.cache_getThemeStories("theme1",false);
        expect(stories.length).to.equal(3);
        expect(stories[2].title).to.equal("story 3");
    });

    it("cache-update-existing-story", async function(){

        await data.saveThemeStory("theme1", {title:"story 3-updated",id:"3"});
        const stories= await data.cache_getThemeStories("theme1",false);
        expect(stories.length).to.equal(3);
        expect(stories[2].title).to.equal("story 3-updated");
    });

    it("cache-save-story-for-theme-not-in-cache",async function(){
        await data.saveThemeStory("unknown", {title:"story 3",id:"3"});
        const stories= await data.cache_getThemeStories("unknown",false);
        expect(stories.length).to.equal(0);


    });

    //methods to save new data, bypassing any caching logic
    async function saveTheme(theme)
    {
        await storage.writeFile(`data/themes/${theme.publicId}.json`, JSON.stringify(theme), "application/json");
    }

    async function saveThemeStory(publicThemeId,story)
    {
        await storage.writeFile(`data/${publicThemeId}/stories/${story.id}.json`,JSON.stringify(story), "application/json");
    }
}

