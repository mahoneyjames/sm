var expect = require('chai').expect;
const {Comment} = require('../../src/club/model/comment');
module.exports = function(accessToken, apiKey, apiSecret, forum, hack){


    describe("sync",function(){

        let storage = null;
        let disqusController = null


        before (async function(){
            
            storage = await hack.loader();    
            hack.storage = storage;
            disqusController = require('../../src/club/controllers/disqusController')
                (accessToken, apiKey, apiSecret, forum, require('../../src/club/model/data')(storage),require('../../src/club/views/html')(storage));            
        });
        

        it("sync all", async function (){
            this.timeout(50000);
            //console.log(forum);
            //this will sync comments for any stories it finds in the data folder
            //from the LIVE disqus site
            const syncResults1 = await disqusController.syncAllComments();
            
            //this is a comment that was added to disqus *since* we built our comments.json file
            expect(syncResults1.newCommentIds[0]).to.equal("4409187852");

            //run the sync a second time, and our file should now have this comment in it...
            const syncResults2= await disqusController.syncAllComments();
            expect(syncResults2.newCommentIds.length).to.equal(0);
            
            

        });

        
        
        it("verify sync all",async()=>{
            
            const comments = await storage.readObjectFromJson("data/comments.json");
            //expect(comments.comments.length).to.equal(17);
            const themeIds = comments.comments.reduce((set, comment)=>{
                set.add(comment.themeId);
                return set;
            },new Set());
            expect(themeIds.size).to.equal(2); //two comments on the new-beginnings theme story. THIS WILL BREAK IF PEOPLE ADD OTHER COMMENTS! We don't have a mock disqus api to use
            expect(themeIds.has("new-beginnings")).to.equal(true);
        });

    });

    return module;
}  



    //function(accessToken, apiKey, apiSecret, forum, storageForData, storageForHtml)