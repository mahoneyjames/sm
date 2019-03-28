var expect = require('chai').expect;
const setup = require('./setup')();
const debug = require('debug')("test-data-methods");

describe('local data-methods', function (){
    require('./_tests/_test-data-methods')(()=>setup.initLocalStorage('data-test-1'));
    
});

//TODO - I think I need to restructure this so that each test gets its own
//folder in local storage or s3 - I can then just load them with known test data
//and run my tests