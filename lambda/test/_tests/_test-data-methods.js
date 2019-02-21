var expect = require('chai').expect;
const {Comment} = require('../../src/club/model/comment');
module.exports = async function(storage){   

    var module = {};
    const data = require('../../src/club/model/data')(storage);

    describe('data-save-comments', ()=>{
        it('clear the comments doc',async ()=>{
            await data.saveAllComments({});

            assertCommentsDoc(await storage.readObjectFromJson("data/comments.json"), [], null);
            
            const commentsDoc = await data.listAllComments();
            assertCommentsDoc(commentsDoc,[], null);
        });

        it('save the comments doc',async ()=>{
            const comments = {
                comments:[new Comment({id:"1", text:"comment 1", name:"bill"})]
            };

            await data.saveAllComments(comments);

            assertCommentsDoc(await storage.readObjectFromJson("data/comments.json"), comments.comments, null);

            const commentsDoc = await data.listAllComments();
            assertCommentsDoc(commentsDoc, comments.comments, null);
            for(const comment of commentsDoc.comments)
            {
                comment.print();
            }
        });


    });

    describe ('data-list all themes and stories', ()=>{
        it('list all', async ()=>{
            const all = await data.listAllThemesAndStories();
            console.log(all);
        });

    });

            
    return module;
}

function assertCommentsDoc(doc, comments, lastCommentDate)
{
    expect(doc.comments.length).to.equal(comments.length);
    expect(doc.lastCommentDate).to.equal(lastCommentDate);
}