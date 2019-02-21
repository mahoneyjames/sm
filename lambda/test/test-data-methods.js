var expect = require('chai').expect;

describe('data-tests: local storage', ()=>{    
    require('./_tests/_test-data-methods')(
        require('../src/club/storage/storage-local.js')({path:"test/sandbox/"})        
    )
});

//TODO - I think I need to restructure this so that each test gets its own
//folder in local storage or s3 - I can then just load them with known test data
//and run my tests