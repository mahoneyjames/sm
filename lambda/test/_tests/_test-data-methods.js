const debug = require('debug')("test-data-methods");
var expect = require('chai').expect;
module.exports = async function(storageLoader){   

    var module = {};

    let data = null;
    let storage = null;
    before(async function(){

        /*
            This is a bit hoop jumpy! Need to figure out a better way.

            Mocha looks through all imports for describe() and it() calls, but 
            any awaits cause it to miss picking things up because the await blocks

            Sometimes the tests will complete, sometimes they won't. Depends whether Mocha thinks
            it has run all the other tests or not before our setup code completes.

            So our technique is to pass a function into the actual test classes to defer 
            setting up local storage until Mocha actually starts to process tests in that file
            This gives us lots of fiddly boilerplate code to copy and paste around. 
            Also, if there are tests in a single file that would like to use their own set of test data, they cannot...
        */
        storage = await storageLoader();
        data = require('../../src/club/model/data')(storage);
    });   


    describe ('data-list all themes and stories', ()=>{
        it('list all', async ()=>{
            const all = await data.listAllThemesAndStories();
            //debug(all);
        });

    });

            
    return module;
}

function assertCommentsDoc(doc, comments, lastCommentDate)
{
    expect(doc.comments.length).to.equal(comments.length);
    expect(doc.lastCommentDate).to.equal(lastCommentDate);
}