// //const logger = require("log2")("commentsController");
// const {listCommentsForTheme,getRecentComments} = require("../model/comment/commentHelpers");
// const {groupBy} = require("../helpers")
// const moment = require("moment");

// module.exports = function(data){

//     var module = {};
//     module.data = data;
    

//     module.getCommentCountsForThemes =async function(publicThemeIds){
//         const comments = await module.data.cache_getAllComments();
        
//         const groupedComments = groupBy(comments.comments, c=>c.themeId);
//         const themes = {};

//         for(const themeId of publicThemeIds)
//         {
//             if(groupedComments.has(themeId))
//             {
//                 themes[themeId] = {total: groupedComments.get(themeId).size};
//             }
//             else
//             {
//                 themes[themeId] = {total:0};
//             }
//         }

//         return {themes};
//     }

//     module.getCommentCountsForStoriesByTheme = async function(publicThemeId)
//     {
        
//         const commentsDoc = await module.data.cache_getAllComments();
//         const comments = listCommentsForTheme(publicThemeId,commentsDoc);
        
//         const groupedComments = groupBy(comments, c=>c.storyPublicId);
//         const stories = await module.data.cache_getThemeStories(publicThemeId);
        
//         const storyCounts = {};
//         for(const story of stories)
//         {
//             let total = 0;
//             if(groupedComments.has(story.publicId))
//             {
//                 total = groupedComments.get(story.publicId).size;
//             }

//             storyCounts[story.publicId] = {total};
//         }

//         return {
//                 themes:
//                     {
//                         [publicThemeId]: {
//                             total: comments.length,
//                             stories: storyCounts
//                         }
//                     }
//                 };
//     }

//     module.listRecentComments = async function(count)
//     {
//         const htmlHelper = require("../views/html")(null);
//         const commentsDoc = await module.data.cache_getAllComments();
//         const comments = getRecentComments(commentsDoc.comments,count);
//         const results = [] ;
//         for(const comment of comments)
//         {
//             comment.publicId = comment.storyPublicId;
//             htmlHelper.buildStoryPath(comment.themeId, comment);

//             results.push({
//                 themeId: comment.themeId,
//                 storyPublicId: comment.storyPublicId,
//                 storyTitle: comment.storyTitle,
//                 storyPath: comment.path,
//                 html: comment.text,
//                 when: comment.when,
//                 userId: comment.userId,
//                 whenFromNow : moment(comment.when).fromNow()
//             });
//         }

//         return results;

//     }

//     module.resetCommentCache = function()
//     {
//         module.data.resetCacheForComments();
//     }
//     return module;
    
// }