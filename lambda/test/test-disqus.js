var expect = require('chai').expect;
const debug = require('debug')("test-controller-user");
const setup = require('./setup')();

require('dotenv').config({ path: 'variables.env' });

const disqusApi = require('../src/club/disqusApi')(
    process.env.disqus_accessToken, 
    process.env.disqus_apiKey, 
    process.env.disqus_apiSecret, 
);

describe.skip ('disqus-api-list-by-story',()=>{
    it('list',async function  (){
        this.timeout(10000);
        const comments = await disqusApi.listStoryComments("storyclub","nd21jm0g26cw");
        //console.log(comments);
        expect(comments.length).to.equal(3);
        expect(comments[0].userName).to.equal("James");
        expect(comments[1].userName).to.equal("Jenny Allan");
        expect(comments[2].userName).to.equal("James");
        // for(const comment of comments)
        // {
        //     console.log(comment.message);
        // }

    });
});

describe.skip('disqus-sync-controller-local storage', function (){   
    
 
    
        const hack = {
            storage: null,
            loader: async function(){
                this.storage = await setup.initLocalStorage("disqus-sync-1");
                return this.storage;
            }

        };
        const syncControllerTests = require('./_tests/_test-disqus')(
            process.env.disqus_accessToken, 
            process.env.disqus_apiKey, 
            process.env.disqus_apiSecret, 
            "storyclub",
            hack);    


       
});