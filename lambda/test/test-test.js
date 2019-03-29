const setup = require('./setup')();

describe ('testing the test-setup class', ()=>
{
    it('test-setup-1', async ()=>{
        await setup.initLocalStorage('site-test-1');
    });

    it('test-setup-2', async ()=>{
        await require('./setup')().initLocalStorage('temp');
    });
});