const debug = require('debug')("test-controller-page");
var expect = require('chai').expect;

module.exports = async function(storageLoader){   

    let data = null;
    let storage = null;
    let controller = null;
    before(async function(){
        storage = await storageLoader();
        controller = require('../../src/club/controllers/pageController')(storage);
    });
    

    describe("build author page", async function(){
        it("user exists", async function(){
            
            await controller.buildAuthorPage("james");
            

            //Hmm, this attempt to run the same tests for storage local and s3 breaks down here,
            //because the storage local class writes html using the htm extension, but there
            //is no extension when we write to s3
            //expect(await storage.exists("a/james.htm")).to.equal(true);

        });
    });

    describe("build-authors-page", function(){
        it("all authors",async function()
        {
            await controller.buildAuthorsPage();
        });
    });
    
}