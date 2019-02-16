const debug = require('debug')("entity-Comment");
class Comment{
    constructor(comment)
    {
        this.themeId = comment.themeId;
        this.storyId = comment.storyId;
        this.storyPublicId = comment.storyPublicId;
        this.storyTitle = comment.storyTitle;
        this.id = comment.id;
        this.userId = comment.userId;
        this.text = comment.text;
        this.when = comment.when;
        this.parentId = comment.parentId;
        
    }

    print(){
        debug("comment: %", this.text);
    }

}

module.exports = {Comment};