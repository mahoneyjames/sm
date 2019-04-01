var expect = require('chai').expect;

describe('local storage: page controller', async ()=>{    
    const setup = require('./setup')();
        
    require('./_tests/_test-controller-page')(()=>setup.initLocalStorage("page-controller-1"));
});

// describe('S3 storage: theme controller', ()=>{    
//     require('./_tests/_test-controller-theme')(
//         require('../src/club/storage/storage-s3.js')({bucket:"barry"}),
//         require('../src/club/storage/storage-s3.js')({bucket:"terry"})
//     )
// });
