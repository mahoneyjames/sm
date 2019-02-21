var expect = require('chai').expect;

describe('site-local storage: site controller', async ()=>{    
    const storageData = require('../src/club/storage/storage-local.js')({path:"test/inputs/site-test-1/"});
    const storageHtml = require('../src/club/storage/storage-local.js')({path:"test/inputs/site-test-1/"});
    
    const siteController = require('../src/club/controllers/siteController.js')(storageData,storageHtml);

    await siteController.rebuildAuthorMissingCommentsPages();
});

// describe('S3 storage: theme controller', ()=>{    
//     require('./_tests/_test-controller-theme')(
//         require('../src/club/storage/storage-s3.js')({bucket:"barry"}),
//         require('../src/club/storage/storage-s3.js')({bucket:"terry"})
//     )
// });
