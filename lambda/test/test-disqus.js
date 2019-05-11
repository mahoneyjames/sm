var expect = require('chai').expect;
const debug = require('debug')("test-controller-user");
const setup = require('./setup')();
const moment = require("moment");
require('dotenv').config({ path: 'variables.env' });

const disqusApi = require('../src/club/disqusApi')(
    process.env.disqus_accessToken, 
    process.env.disqus_apiKey, 
    process.env.disqus_apiSecret, 
);

describe ('disqus-api-list-by-story',()=>{
    it('list',async function  (){
        this.timeout(10000);
        const comments = await disqusApi.listStoryComments("storyclub","nd21jm0g26cw");
        console.log(comments);
        expect(comments.length).to.equal(3);
        expect(comments[0].userName).to.equal("James");
        expect(comments[1].userName).to.equal("Jenny Allan");
        expect(comments[2].userName).to.equal("James");
        // for(const comment of comments)
        // {
        //     console.log(comment.message);
        // }

    });

    it('list-mock', async function(){
        const mockDisqusApi = require('./mocks/mock-disqusApi.js')(require('../src/club/storage/storage-local.js')({path:'./test/inputs/disqus-api-1/disqus-data'}));
        const comments = await mockDisqusApi.listStoryComments("storyclub","nd21jm0g26cw");
        console.log(comments);
        expect(comments.length).to.equal(3);
        expect(comments[0].userName).to.equal("James");
        expect(comments[1].userName).to.equal("Jenny Allan");
        expect(comments[2].userName).to.equal("James");
    });
});

// describe.skip('disqus-sync-controller-local storage', function (){   
    
 
    
//         const hack = {
//             storage: null,
//             loader: async function(){
//                 this.storage = await setup.initLocalStorage("disqus-sync-1");
//                 return this.storage;
//             }

//         };
//         const syncControllerTests = require('./_tests/_test-disqus')(
//             process.env.disqus_accessToken, 
//             process.env.disqus_apiKey, 
//             process.env.disqus_apiSecret, 
//             "storyclub",
//             hack);    


       
// });


        /*
      [x]   no comment doc
            lastSyncDate is null
      [x]    - no new comments
      [x]    - new comments
            last sync data is older than the config
      [x]    - no new comments
      [x]    - new comments
            force sync is true 
      [ ]    - no new comments
      [ ]    - new comments
        
          partial sync is run
      [ ]     - no new comments
      [x]     - new comments



    */

const mockDisqusApi = require('./mocks/mock-disqusApi.js')(require('../src/club/storage/storage-local.js')({path:'./test/inputs/disqus-sync/mock-disqus-data'}));

describe("disqus-sync", function(){
    it("no-comment-doc", async function(){
        mockDisqusApi.setTestStep("step1");
        const storage = await setup.initLocalStorage("disqus-sync/initial-storage-data", "disqus-sync/no-comments-doc");
        const disqusController = require('../src/club/controllers/disqusController')(mockDisqusApi,
                                                                                    "storyclub",
                                                                                    require('../src/club/model/data')(storage),
                                                                                    require('../src/club/views/html')(storage) );
        const comments = await disqusController.syncComments();
        //console.log(comments);
        expect(comments.comments.length).to.equal(3);
        expect(comments.lastFullSyncDate).to.not.be.null;
        expect(comments.newCommentIds.length).to.equal(3);

        const commentsDoc = await storage.readObjectFromJson("data/comments.json");
        expect(commentsDoc.comments.length).to.equal(3);
        expect(commentsDoc.lastFullSyncDate).to.not.be.null;
    });

    it("last-sync-data-null-no-new-comments", async function(){
        mockDisqusApi.setTestStep("no-comments");
        const storage = await setup.initLocalStorage("disqus-sync/initial-storage-data", "disqus-sync/last-sync-date-null-no-new-comments");

        await storage.writeFile("data/comments.json","{}");

        const disqusController = require('../src/club/controllers/disqusController')(mockDisqusApi,
                                                                                    "storyclub",
                                                                                    require('../src/club/model/data')(storage),
                                                                                    require('../src/club/views/html')(storage) );
        const comments = await disqusController.syncComments();
       // console.log(comments);
        expect(comments.comments.length).to.equal(0);
        expect(comments.lastFullSyncDate).to.not.be.null;
        expect(comments.newCommentIds.length).to.equal(0);

        const commentsDoc = await storage.readObjectFromJson("data/comments.json");
        expect(commentsDoc.comments.length).to.equal(0);
        expect(commentsDoc.lastFullSyncDate).to.not.be.null;
    });

    it("last-sync-data-null-new-comments", async function(){
        mockDisqusApi.setTestStep("step1");
        const storage = await setup.initLocalStorage("disqus-sync/initial-storage-data", "disqus-sync/last-sync-date-null-new-comments");

        await storage.writeFile("data/comments.json","{}");

        const disqusController = require('../src/club/controllers/disqusController')(mockDisqusApi,
                                                                                    "storyclub",
                                                                                    require('../src/club/model/data')(storage),
                                                                                    require('../src/club/views/html')(storage) );
        const comments = await disqusController.syncComments();
        //console.log(comments);
        expect(comments.comments.length).to.equal(3);
        expect(comments.lastFullSyncDate).to.not.be.null;
        expect(comments.newCommentIds.length).to.equal(3);

        const commentsDoc = await storage.readObjectFromJson("data/comments.json");
        expect(commentsDoc.comments.length).to.equal(3);
        expect(commentsDoc.lastFullSyncDate).to.not.be.null;
    });   
    
    it("last-sync-date-older-new-comments", async function(){
        mockDisqusApi.setTestStep("step1");
        const storage = await setup.initLocalStorage("disqus-sync/initial-storage-data", "disqus-sync/last-sync-date-older-new-comments");

        await storage.writeFile("data/comments.json",JSON.stringify({lastFullSyncDate: moment().add(-3, "hours")}));

        
        const disqusController = require('../src/club/controllers/disqusController')(mockDisqusApi,
                                                                                    "storyclub",
                                                                                    require('../src/club/model/data')(storage),
                                                                                    require('../src/club/views/html')(storage) );
        const comments = await disqusController.syncComments();
        //console.log(comments);
        expect(comments.comments.length).to.equal(3);
        expect(comments.lastFullSyncDate).to.not.be.null;
        expect(comments.newCommentIds.length).to.equal(3);

        const commentsDoc = await storage.readObjectFromJson("data/comments.json");
        expect(commentsDoc.comments.length).to.equal(3);
        expect(commentsDoc.lastFullSyncDate).to.not.be.null;
    });    

    it("last-sync-date-older-no-new-comments", async function(){
        mockDisqusApi.setTestStep("no-comments");
        const storage = await setup.initLocalStorage("disqus-sync/initial-storage-data", "disqus-sync/last-sync-date-older-no-new-comments");

        await storage.writeFile("data/comments.json",JSON.stringify({lastFullSyncDate: moment().add(-3, "hours")}));

        const disqusController = require('../src/club/controllers/disqusController')(mockDisqusApi,
                                                                                    "storyclub",
                                                                                    require('../src/club/model/data')(storage),
                                                                                    require('../src/club/views/html')(storage) );
        const comments = await disqusController.syncComments();
        //console.log(comments);
        expect(comments.comments.length).to.equal(0);
        expect(comments.lastFullSyncDate).to.not.be.null;
        expect(comments.newCommentIds.length).to.equal(0);

        const commentsDoc = await storage.readObjectFromJson("data/comments.json");
        expect(commentsDoc.comments.length).to.equal(0);
        expect(commentsDoc.lastFullSyncDate).to.not.be.null;
    });    

    /*

    These are our theme deadlines 
    theme1 2019-01-01
    theme2 2019-01-07
    theme3 2018-01-01
    theme4 2017-01-01
    theme5 2020-01-01
    theme6 2015-01-01

    We should sync the 4 most recent i.e. 5,1,2,3

    We test it by adding comments for *all* themes into our source doc, but only comments for these themes should appear...

    */
    it("partial-sync-new-comments", async function(){
        
        const storage = await setup.initLocalStorage("disqus-sync/initial-storage-data", "disqus-sync/partial-sync-new-comments");
        const disqusController = require('../src/club/controllers/disqusController')(mockDisqusApi,
            "storyclub",
            require('../src/club/model/data')(storage),
            require('../src/club/views/html')(storage) );

        await storage.writeFile("data/comments.json","{}");
        mockDisqusApi.setTestStep("step1");
       
        const initalSyncComments = await disqusController.syncComments();        
        expect(initalSyncComments.comments.length).to.equal(3);
        expect(initalSyncComments.lastFullSyncDate).to.not.be.null;
        expect(initalSyncComments.newCommentIds.length).to.equal(3);

        expect(initalSyncComments.comments[0].text).to.equal("theme1-story1-comment1");
        expect(initalSyncComments.comments[1].text).to.equal("theme1-story1-comment2");
        expect(initalSyncComments.comments[2].text).to.equal("theme1-story1-comment3");

        //now we run the sync, but only 4 comments should come back, even though we have added 6 comments to our mock disqus
        mockDisqusApi.setTestStep("partial-sync-new-comments");
        const partialSyncComments = await disqusController.syncComments();    
        expect(partialSyncComments.comments.length).to.equal(7);        
        expect(partialSyncComments.newCommentIds.length).to.equal(4);

        expect(initalSyncComments.comments[0].text).to.equal("theme1-story1-comment1");
        expect(initalSyncComments.comments[1].text).to.equal("theme1-story1-comment2");
        expect(initalSyncComments.comments[2].text).to.equal("theme1-story1-comment3");

        const commentsDoc = await storage.readObjectFromJson("data/comments.json");
        expect(commentsDoc.comments.length).to.equal(7);
        expect(commentsDoc.lastFullSyncDate).to.not.be.null;

        //run the sync yet again, and once more it should ignore anything from theme 4 and 6
        const partialSyncComments2 = await disqusController.syncComments();    
        expect(partialSyncComments2.comments.length).to.equal(7);        
        expect(partialSyncComments2.newCommentIds.length).to.equal(0);
    });  


    it("sync-unknown-user", async function(){
        
        const storage = await setup.initLocalStorage("disqus-sync/initial-storage-data", "disqus-sync/sync-unknown-user");
        const disqusController = require('../src/club/controllers/disqusController')(mockDisqusApi,
            "storyclub",
            require('../src/club/model/data')(storage),
            require('../src/club/views/html')(storage) );

        await storage.writeFile("data/comments.json","{}");
        mockDisqusApi.setTestStep("unknown-user");
       
        const initalSyncComments = await disqusController.syncComments();    
        console.log(initalSyncComments);    

        //No comments come back for the unknown user. They get added into an unknown users array
        expect(initalSyncComments.comments.length).to.equal(0);
        
        
        
    });  
    
    
});