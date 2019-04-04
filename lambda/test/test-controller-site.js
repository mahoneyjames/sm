var expect = require('chai').expect;

describe('site-local storage: site controller', ()=>{    
    let storageData = null;
    let storageHtml = null;
    
    let siteController = null;

    before(async function(){
        storageData = require('../src/club/storage/storage-local.js')({path:"test/inputs/site-test-1/"});
        storageHtml = require('../src/club/storage/storage-local.js')({path:"test/inputs/site-test-1/"});
        siteController = require('../src/club/controllers/siteController.js')(require('../src/club/model/data')(storageData),require('../src/club/views/html')(storageHtml));
    });

    it("rebuild missing comments pages",async function(){
        await siteController.rebuildAuthorMissingCommentsPages();
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
