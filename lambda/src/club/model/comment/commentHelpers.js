module.exports.listNewCommentIds = (originalComments, newComments)=>{

    const originalCommentsIds = originalComments.comments.map(c=>c.id);
    const newCommentIds = newComments.comments.map(c=>c.id);

    return newCommentIds.filter(id=> originalCommentsIds.indexOf(id)<0);
}

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