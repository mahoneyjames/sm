var expect = require('chai').expect;

describe('local storage: controller-theme', async ()=>{    
    const setup = require('./setup')();
    const debug = require('debug')("test-data-methods");
    
    require('./_tests/_test-controller-theme')(()=>setup.initLocalStorage("theme-controller-1"));
});

// describe('S3 storage: theme controller', ()=>{    
//     require('./_tests/_test-controller-theme')(
//         require('../src/club/storage/storage-s3.js')({bucket:"barry"}),
//         require('../src/club/storage/storage-s3.js')({bucket:"terry"})
//     )
// });
