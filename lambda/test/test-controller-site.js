var expect = require('chai').expect;

describe('site-local storage: siteController', ()=>{    
    let storage = null;
    const setup = require('./setup')();
    
    let siteController = null;

    before(async function(){
        storage = await setup.initLocalStorage("site-test-1/");
        
        siteController = require('../src/club/controllers/siteController.js')(require('../src/club/model/data')(storage),require('../src/club/views/html')(storage));
    });

    // it("rebuild missing comments pages",async function(){
    //     await siteController.rebuildAuthorMissingCommentsPages();
    // });

    it("rebuild missing comments pages-specific users",async function(){
        console.log("here");
        await siteController.rebuildAuthorMissingCommentsPages(["james","jenny"]);
    });

    it("rebuild home page", async function(){
        await siteController.rebuildHomePage();
    });
});

// describe('S3 storage: theme controller', ()=>{    
//     require('./_tests/_test-controller-theme')(
//         require('../src/club/storage/storage-s3.js')({bucket:"barry"}),
//         require('../src/club/storage/storage-s3.js')({bucket:"terry"})
//     )
// });
