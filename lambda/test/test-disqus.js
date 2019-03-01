var expect = require('chai').expect;
require('dotenv').config({ path: 'variables.env' });

const disqusApi = require('../src/club/disqusApi')(
    process.env.disqus_accessToken, 
    process.env.disqus_apiKey, 
    process.env.disqus_apiSecret, 
);

describe ('disqus-api-list-by-story',()=>{
    it('list', async ()=>{
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

describe('disqus-sync-controller-local storage', ()=>{   
    const storage =  require('../src/club/storage/storage-local.js')({path:"./test/_data/disqus-sync-1/"}) ;
    require('./_tests/_test-disqus')(
        process.env.disqus_accessToken, 
        process.env.disqus_apiKey, 
        process.env.disqus_apiSecret, 
        "storyclub",
        storage);     
        
        it("verify sync all",async()=>{
            const comments = await storage.readObjectFromJson("data/comments.json");
            expect(comments.comments.length).to.equal(17);
            const themeIds = comments.comments.reduce((set, comment)=>{
                set.add(comment.themeId);
                return set;
            },new Set());
            expect(themeIds.size).to.equal(1);
            expect(themeIds.has("new-beginnings")).to.equal(true);
        });

       
});