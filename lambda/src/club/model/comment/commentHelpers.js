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