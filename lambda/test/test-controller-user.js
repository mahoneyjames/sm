var expect = require('chai').expect;
const debug = require('debug')("test-controller-user");
const setup = require('./setup')();

describe('local-storage', async ()=>{       
    const tests = require('./_tests/_test-controller-user')(()=>setup.initLocalStorage('userController/1')); 
});

