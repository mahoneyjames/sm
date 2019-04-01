const expect = require('chai').expect;
const debug = require('debug')("test-data-cache");
const setup = require('./setup')();

describe("data-cache", function(){

    let storage = null;
    let data = null;
    before(async function(){
        storage = await setup.initLocalStorage("data-cache-1");
        data = require('../src/club/model/data')(storage);
    });

    
    it("get user-cache-hit",async function(){
        const cache = getCache(data);
        //fake up some data in our user object
        cache.cache.users = [{id:"one", name: "barry"}, {id:"two", name: "tom"}];
        const user = await cache.getUser("one");
        expect(user.name).to.equal("barry");
    });

    it("get user-cache-miss",async function(){
        const cache = getCache(data);
        
        const user = await cache.getUser("james");
        expect(user.name).to.equal("James");
    });

    it("list all themes and stories: cache miss", async function(){
        const cache = getCache(data);
        const all = await cache.listAllThemesAndStories();
        expect(all.length).to.equal(2);
        
    });

    it("list all themes and stories: cache hit", async function(){
        const cache = getCache(data);
        const all = await cache.listAllThemesAndStories();
        expect(all.length).to.equal(2);
        
        cache.cache.listAllThemesAndStories.push({});

        const all2 = await cache.listAllThemesAndStories();
        expect(all2.length).to.equal(3);

    });

});

function getCache(data)
{
    return require('../src/club/model/data-cache')(data);
}