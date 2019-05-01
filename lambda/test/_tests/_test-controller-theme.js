
var expect = require('chai').expect;
var moment = require('moment');
//https://zaiste.net/modern_node_js_async_await_based_testing_with_mocha_chai/
//use before and beforeEach for setup?

module.exports = async function(storageLoader){   

    var module = {};
    let controller = null;
    let storageForData = null;
    let data = null;
    before(async function(){
        storageForData = await storageLoader();

        data = require('../../src/club/model/data')(storageForData);
        controller = require('../../src/club/controllers/theme')(data,require('../../src/club/views/html')(storageForData));

    });

    
    describe('valid theme-full workflow', ()=>{

        const themeText = `unit-test-theme-${moment().format("YYYY-MM-DD-HH-mm-ss")}`;

        console.log(themeText);
        
        var theme = {
            themeText:themeText, 
            things:['thing 1', 'thing 2', 'thing 3'],
            deadline: '2019-01-01',
            path:themeText
        };

        it('create theme',async ()=>{
            
            var savedTheme = await controller.createThemeChallenge(theme);
            //console.log(JSON.stringify(savedTheme));
            expect(savedTheme.errors.length).to.equal(0);
            var persistedTheme = await storageForData.readObjectFromJson(`/data/themes/${themeText}.json`);
            expect(persistedTheme.themeText).to.equal(themeText);
            });

        it('add story 1',async ()=>{
            
            var story = {title:"story1", content: "story content"};
            var savedStory = await controller.previewStory(themeText,story);
            
            expect(savedStory.errors.length).to.equal(0);

            var stories = await storageForData.listObjectsFromJson(`/data/${themeText}/stories`);
            expect(stories.length).to.equal(1);
            expect(stories[0].title).to.equal("story1");
        });

        it('add story 2',async ()=>{
            
            var story = {title:"story2", content: "story content"};
            var savedStory = await controller.previewStory(themeText,story);
            
            expect(savedStory.errors.length).to.equal(0);

            var stories = await storageForData.listObjectsFromJson(`/data/${themeText}/stories`);
            expect(stories.length).to.equal(2);
            expect(stories[1].title).to.equal("story2");
        });

        it('publish stories for review', async()=>{

            await controller.publishThemeForReview(themeText);
            var persistedTheme = await storageForData.readObjectFromJson(`/data/themes/${themeText}.json`);
            expect(persistedTheme.status).to.equal("review");
        });

        it('close theme', async()=>{

            await controller.closeTheme(themeText);
            var persistedTheme = await storageForData.readObjectFromJson(`/data/themes/${themeText}.json`);
            expect(persistedTheme.status).to.equal("complete");
        });

        it('add comments and rebuild theme', async function(){

            await data.saveAllComments({comments:[
                //TODO - add some comments!
            ]});
            await controller.rebuildThemePage(themeText);
            var persistedTheme = await storageForData.readObjectFromJson(`/data/themes/${themeText}.json`);
            expect(persistedTheme.status).to.equal("complete");
        });

    });

    return module;
}