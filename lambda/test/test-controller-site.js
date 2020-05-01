var expect = require('chai').expect;

const setup = require('./setup')();

describe('site-local storage: siteController', ()=>{    
    let storage = null;    
    let siteController = null;

    before(async function(){
        storage = await setup.initLocalStorage("site-test-1/");
        
        siteController = require('../src/club/controllers/siteController.js')(require('../src/club/model/data')(storage),require('storyclub-views')(storage,"./src/club/views"));
    });

    it("rebuild home page", async function(){
        await siteController.rebuildHomePage();
    });



});