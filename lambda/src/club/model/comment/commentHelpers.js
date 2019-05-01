const {groupBy} = require("../../helpers")
/*
    Returns a list of the ids of any comment that is in newComments, but not originalComments
*/
module.exports.listNewCommentIds = (originalComments, newComments)=>{

    const originalCommentsIds = originalComments.comments.map(c=>c.id);
    const newCommentIds = newComments.comments.map(c=>c.id);

    return newCommentIds.filter(id=> originalCommentsIds.indexOf(id)<0);
}

/*
    Returns the user ids for the specified comment ids
*/
module.exports.listsUsersForCommentIds = (comments, commentIds)=>{
    
    
    return commentIds.map(id=>
        {
            const comment = comments.comments.filter(c=>c.id==id);
            if(comment.length>0)
            {
    
                return comment[0].userId;
            }
        }
    );
}

module.exports.listThemeIdsForCommentIds = (comments, commentIds)=>{
    return commentIds.map(id=>
        {
            const comment = comments.comments.filter(c=>c.id==id);
            if(comment.length>0)
            {
    
                return comment[0].themeId;
            }
        }
    );
}
/*
    Returns only comments for the specified theme
*/
module.exports.listCommentsForTheme = (publicThemeId, commentsDoc)=>{
    return commentsDoc.comments.filter(c=>c.themeId==publicThemeId);
}


/*
    Converts a flat list of comments into a tree, where child comments are nested under their parent
    The starting point is a "story", using the storyId we pick up from the comments
    This is not the full story data
*/
module.exports.convertCommentArrayToTree = function(comments){

    
    const commentTree = {};
    const rootComments= {};
    const stories = [];

    //Key our comments by comment id, and work out all the distinct stories that we have
    for(const comment of comments)
    {
        //console.log(comment.id,comment.parentId);
        commentTree[comment.id] = comment;
        comment.comments=[];
        if(comment.parentId==null)
        {
            let story = rootComments[comment.storyPublicId];
            if(story==null)
            {
                story = {
                        comments:[], 
                        title: comment.storyTitle, 
                        publicId: comment.storyPublicId
                    };

                rootComments[comment.storyPublicId] = story;       
                stories.push(story)                       ;
            }

            story.comments.push(comment);
            
        }
    }

    //add each comment to its parent
    for(const comment of comments)
    {
        if(comment.parentId!=null)
        {
            const parent = commentTree[comment.parentId];
            if(parent!=null)
            {
                //console.log(parent.id);
                parent.comments.push(comment);
            }
        }
    }

    return{storyList: stories, storiesById: rootComments };
}

/*
    Copies any comments for a specific story to that story
*/
module.exports.addCommentsToStories = function (stories,comments)
{
    const commentTree = module.exports.convertCommentArrayToTree(comments);
    for(const story of stories)
    {
        if(commentTree.storiesById[story.publicId])
        {
            story.comments = commentTree.storiesById[story.publicId].comments;
        }
        else
        {
            story.comments = [];
        }
    }
    
}

module.exports.addCommentCountsToThemes = function(themes, comments)
{
    const themeCounts = groupBy(comments,c=>c.themeId);
    //console.log(themeCounts);
    for(const theme of themes)
    {
        if(themeCounts.has(theme.publicId))
        {
            theme.commentCount = themeCounts.get(theme.publicId).size;
        }
        else
        {
            theme.commentCount = 0;
        }
    }
}

module.exports.getRecentComments = function(comments, count)
{
    return comments.sort((a,b)=>{
            if(!a.when || !b.when)
            {
                return 0;
            }
            else if(a.when > b.when)
            {
                return -1;
            }
            else
            {
                return 1;
            }
    }).slice(0,count);
}