const expect = require('chai').expect;
const debug = require('debug')("test-model");
const moment = require('moment');


describe("comments-listNewCommentIds", function(){
    const {listNewCommentIds} = require("../src/club/model/comment/commentHelpers");

    it("two blank docs", function(){
        const original = {comments:[]};
        const newDoc = {comments:[]};
        expect(listNewCommentIds(original, newDoc).length).to.equal(0);
    });

    it("old doc is empty, new doc has comments", function(){
        const original = {comments:[]};
        const newDoc = {comments:[{id:1},{id:2}]};
        expect(listNewCommentIds(original, newDoc).length).to.equal(2);
    });

    it("docs are the same", function(){
        const original = {comments:[{id:2},{id:1}]};
        const newDoc = {comments:[{id:1},{id:2}]};
        expect(listNewCommentIds(original, newDoc).length).to.equal(0);
    });

    it("1 new comment", function(){
        const original = {comments:[{id:2},{id:1}]};
        const newDoc = {comments:[{id:1},{id:2},{id:3}]};
        expect(listNewCommentIds(original, newDoc).length).to.equal(1);
    });



});

describe("comments-getUserIdsForCommentIds", function(){
    const {listsUsersForCommentIds} = require("../src/club/model/comment/commentHelpers");

    it("test-1", function(){
        const users = listsUsersForCommentIds(
            {
                comments: [{id:"1",userId:"u1"},
                            {id:"2",userId:"u2"},
                            {id:"3",userId:"u3"},
                            {id:"4",userId:"u4"}]
            },
            ["2","4"]);

            //console.log(users);
            expect(users.length).to.equal(2);
            expect(users[0]).to.equal("u2");
            expect(users[1]).to.equal("u4");
        });
});