var expect = require('chai').expect;

describe('local-storage', async ()=>{   
     const storage =require('../src/club/storage/storage-local.js')({path:"test/_data/userController/1/"}); 
    
    const tests = require('./_tests/_test-controller-user')(storage);

//console.log();
    //tests.test();
    
    
});

// describe('S3 storage: theme controller', ()=>{    
//     require('./_tests/_test-controller-theme')(
//         require('../src/club/storage/storage-s3.js')({bucket:"barry"}),
//         require('../src/club/storage/storage-s3.js')({bucket:"terry"})
//     )
// });
