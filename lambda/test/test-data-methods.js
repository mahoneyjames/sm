var expect = require('chai').expect;

describe('data-tests: local storage', ()=>{    
    require('./_tests/_test-data-methods')(
        require('../src/club/storage/storage-local.js')({path:"_site/unittest/"})        
    )
});