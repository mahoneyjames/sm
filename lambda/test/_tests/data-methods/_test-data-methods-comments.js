// const debug = require('debug')("test-data-methods");
// var expect = require('chai').expect;
// module.exports = async function(storageLoader){   

//     var module = {};

//     let data = null;
//     let storage = null;

//     before(async function(){
//         storage = await storageLoader();
//         data = require('../../../src/club/model/data')(storage);
//     });

//     it("list-comments-none-found", async function(){
//         const comments = await data.listAllComments();
//         expect(comments.comments.length).to.equal(0);
//     });

//     it("save-comments", async function(){
//         await data.saveAllComments({"comments":[{"id":"1","text":"original comment","themeId":"theme-1"},{"id":"2","text":"original comment 2", "themeId":"theme-2"}],"lastCommentDate":null});
//         const comments = await data.listAllComments();

//         expect(comments.comments.length).to.equal(2);
//         expect(comments.comments[0].text).to.equal("original comment");

//     });

//     it("get-comments-from-cache-reload-is-false", async function(){
        
        
//         const comments = await data.cache_getAllComments();
        
//         expect(comments.comments.length).to.equal(2);
//         expect(comments.comments[0].text).to.equal("original comment");

//     });

//     it("save-comments-check-cache-updated", async function(){
//         const comments = await data.cache_getAllComments();
//         comments.comments.push({id:"three"});

//         await data.saveAllComments(comments);
//         const freshComments = await data.cache_getAllComments();
//         expect(comments.comments.length).to.equal(3);
//         expect(comments.comments[2].id).to.equal("three");
//     });

//     it("get-comments-for-theme-none-found", async function(){
//         const comments = await data.cache_getCommentsForTheme("blah");
//         expect(comments.length).to.equal(0);
//     });

//     it("get-comments-for-theme-comments-found", async function(){
        
//         const comments = await data.cache_getAllComments();
//         comments.comments.push({id:"four", themeId:"theme-1"});
//         await data.saveAllComments(comments);
//         expect(comments.comments.length).to.equal(4);

//         const commentsForTheme = await data.cache_getCommentsForTheme("theme-1");
//         expect(commentsForTheme.length).to.equal(2);
//     });

// }