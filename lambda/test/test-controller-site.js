var expect = require('chai').expect;

const setup = require('./setup')();

describe('site-local storage: siteController', ()=>{    
    let storage = null;    
    let siteController = null;

    before(async function(){
        storage = await setup.initLocalStorage("site-test-1/");
        
        siteController = require('../src/club/controllers/siteController.js')(require('../src/club/model/data')(storage),require('../src/club/views/html')(storage,"./src/club/views"));
    });

    // it("rebuild missing comments pages",async function(){
    //     await siteController.rebuildAuthorMissingCommentsPages();
    // });

    it("rebuild missing comments pages-specific users",async function(){
        console.log("here");
        await siteController.rebuildAuthorMissingCommentsPages(["james","jenny"]);
    });

    it("rebuild home page", async function(){
        await siteController.rebuildHomePage();
    });



});
describe("site-local storage: siteController.refreshBasedOnNewComments", function (){
    let storage = null;    
    let siteController = null;

    before(async function(){

        storage = await setup.initLocalStorage("site-test-1/","site-test-2-refresh-based-on-comments");
        
        siteController = require('../src/club/controllers/siteController.js')(require('../src/club/model/data')(storage),require('../src/club/views/html')(storage,"./src/club/views"));
    })

    it("no new comments", async function()
    {        
        await siteController.refreshBasedOnNewComments({comments:[]}, []);
        //TODO - assert no HTML is updated
    });

    const newComments = [
        {
            "themeId": "heart-warming",
            "storyId": "140gux1jt7a6qdm",
            "storyPublicId": "suburban-flight",
            "storyTitle": "Suburban Flight",
            "id": "4384825025",
            "userId": "liz",
            "text": "<p>heart warming comment 1</p>",
            "when": "2019-03-19T08:06:08",
            "parentId": null
        },
        {
            "themeId": "heart-warming",
            "storyId": "140gux1jt7a6qdm",
            "storyPublicId": "suburban-flight",
            "storyTitle": "Suburban Flight",
            "id": "4384824485",
            "userId": "james",
            "text": "heart warming comment 2",
            "when": "2019-03-19T08:05:10",
            "parentId": null
        },
        {
            "themeId": "new-beginnings",
            "storyId": "140gux1jt7a6qdm",
            "storyPublicId": "suburban-flight",
            "storyTitle": "Suburban Flight",
            "id": "4379232859",
            "userId": "jenny",
            "text": "new beginnings comment",
            "when": "2019-03-15T08:03:46",
            "parentId": null
        },
        //This next comment won't have its id passed as a newCommentId, so should not trigger an update for lewis, or the sinister theme
        {
            "themeId": "sinister",
            "storyId": "140gux1jt7a6qdm",
            "storyPublicId": "suburban-flight",
            "storyTitle": "Suburban Flight",
            "id": "437923283359",
            "userId": "lewis",
            "text": "new beginnings comment",
            "when": "2019-03-15T08:03:46",
            "parentId": null
        }];
    it("has new comments", async function()
    {        
        /*
            Pretend that we have synced and have new comments from Liz, James and Jenny
            These are for themes heart-warming and new-beginnings

            The following should get updated
             - missing comments page for Liz, James and Jenny

            These should not get updated
             - home page
             - two theme pages
             - the themes list pages
        */

        
        await siteController.refreshBasedOnNewComments(newComments, ["4384825025","4384824485","4379232859"]);
        //TODO - assert HTML is updated
    });

    it("notifyOtherLambdaAboutNewComments", async function()
    {
        //this test requires our lambda endpoint to be up and running

        /*
            No assertions, because this is a bit of hodge podge, and won't be needed once we start putting comments
            into dynamodb. 

            But...in the meantime...
            Go to the _site/club/u directory and delete any user missing comments pages
            npm run host-test-api-black
            Run this test
            Go to the _site/club/u directory
            A user page should have been created for Liz, James and Jenny


        */
       process.env.URL_NOTIFY_NEW_COMMENTS = "http://localhost:34333/api/kldjfklasdjfkladfjkldjfdasf/comments/notifyUpdates";
        siteController.notifyOtherLambdaAboutNewComments(newComments, ["4384825025","4384824485","4379232859"])

    });

});
// describe('S3 storage: theme controller', ()=>{    
//     require('./_tests/_test-controller-theme')(
//         require('../src/club/storage/storage-s3.js')({bucket:"barry"}),
//         require('../src/club/storage/storage-s3.js')({bucket:"terry"})
//     )
// });
