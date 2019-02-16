var expect = require('chai').expect;
const {Comment} = require('../../src/club/model/comment');
module.exports = async function(accessToken, apiKey, apiSecret, forum, storageForData){

    const disqusController = require('../../src/club/controllers/disqusController')
        (accessToken, apiKey, apiSecret, forum, storageForData,storageForData);
    describe("sync",()=>{
        it("list all", async ()=>{
            console.log(forum);
            await disqusController.syncAllComments();

            
            

        }).timeout(50000);
    });

    return {};
}  



    //function(accessToken, apiKey, apiSecret, forum, storageForData, storageForHtml)