
describe("sandbox-comment-tree", function(){

    const storage = require('storage-1').local({path:"_site/club/"});
    // before(async function(){
    //     storage = await setup.initLocalStorage("sandbox-comment-tree");        
    // });

    it("flat->tree",async function(){

        const data = require('../src/club/model/data')(storage);
        const commentsDoc = await data.listAllComments();

        const commentTree = {rootComents:[]};
        const rootComments= {};

        for(const comment of commentsDoc.comments)
        {
            //console.log(comment.id,comment.parentId);
            commentTree[comment.id] = comment;
            comment.children=[];
            if(comment.parentId==null)
            {
                let story = rootComments[comment.storyPublicId];
                if(story==null)
                {
                    story = {comments:[], title: comment.storyTitle};
                    rootComments[comment.storyPublicId] = story;                              
                }

                story.comments.push(comment);
                
            }
        }

        for(const comment of commentsDoc.comments)
        {
            if(comment.parentId!=null)
            {
                const parent = commentTree[comment.parentId];
                if(parent!=null)
                {
                    //console.log(parent.id);
                    parent.children.push(comment);
                }
            }
        }

    //     console.log(commentsDoc.comments.length,rootComments.length);

    //     const printComment = (comment, depth)=> {
    //         console.log("".padStart(depth*2, "-") +":" + depth + ":"+ comment.id + ":"  + comment.parentId + ":" + comment.userId + ":" +  comment.text.slice(0,50));
    //         if(comment.children)
    //         {
    //             comment.children.forEach(c=>printComment(c,depth+1));
    //         }
    //     }
    //     for(const i in rootComments)
    //     {
    //         const story = rootComments[i];
    //         console.log(story.title);
    //     story.comments.forEach(c=>{
            
    //         printComment(c,0);
            

    //     });
    //     console.log();
    //     //https://www.webdesignerdepot.com/2013/01/how-to-build-a-threaded-comment-block-with-html5-and-css3/
    //     //https://www.webdesignerdepot.com/cdn-origin/uploads7/building-a-threaded-comment-block-with-html5-and-css3/demo/

    // }

    const html = require('../src/club/views/html')(storage);
    await html.writeAllCommentsPage(rootComments);
            


    });

});
