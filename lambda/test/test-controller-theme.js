var expect = require('chai').expect;

describe('local storage: theme controller', ()=>{    
    require('./_tests/_test-controller-theme')(
        require('../src/club/storage/storage-local.js')({path:"_site/unittest/"}),
        require('../src/club/storage/storage-local.js')({path:"_site/unittest/"})
    )
});

// describe('S3 storage: theme controller', ()=>{    
//     require('./_tests/_test-controller-theme')(
//         require('../src/club/storage/storage-s3.js')({bucket:"barry"}),
//         require('../src/club/storage/storage-s3.js')({bucket:"terry"})
//     )
// });
