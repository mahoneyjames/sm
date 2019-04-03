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

    it("load-users", async function(){
        const users = await data.loadUsers();
        expect(users.length).to.equal(5);
        expect(users[0].id).to.equal("liz");
    });

    it("get-users-cache-miss", async function(){
        const users = await data.cache_getUsers();
        expect(users.length).to.equal(5);
        expect(users[0].id).to.equal("liz");
    });

    it("get-users-cache-hit", async function(){
        //monkey with our cache, to prove that we load from cache instead of storage
        data.cache.users = [];
        const users = await data.cache_getUsers();
        expect(users.length).to.equal(0);
        
    });

    it("get-users-cache-hit-reload-is-true", async function(){
        //monkey with our cache, to prove that we load from cache instead of storage
        //but since reload=true, we'll get our data. yay!
        data.cache.users = [];
        const users = await data.cache_getUsers(true);
        expect(users.length).to.equal(5);
        expect(users[0].id).to.equal("liz");        
    });

    it("get-user", async function(){
        const user = await data.cache_getUser("james");
        //console.log("xxx", user);
        expect(user.id).to.equal("james");
    });
}