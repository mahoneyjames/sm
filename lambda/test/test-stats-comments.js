var expect = require('chai').expect;
const storage = require('../src/club/storage/storage-local')({path:'test/_stats/test1/'});
const data = require('../src/club/model/data')(storage);
const statsBuilder = require('../src/club/model/stats')();

describe ("stats-comments-manual", ()=>{
    console.log("stats1");
    it("stats1",async ()=>{
        const users = await data.loadUsers();
        const allThemes = await data.loadCommentDoc();

        //TODO - manually verify results
        
        const results = statsBuilder.buildLeagueTable(users,allThemes);
        expect(results.totalStories).to.equal(63);
        expect(results.totalThemes).to.equal(19);

        expect(results.users[0].user.id).to.equal("james");
        expect(results.users[1].user.id).to.equal("hannah");

        console.log("use\ttotal\tdisqus\tone month");
        for(const user of results.users)
        {
            console.log(`${user.user.id}\t${user.totalStoriesSinceJoined}\t${user.totalStoriesSinceDisqus}\t${user.totalStoriesLastTwoMonths}`);
        }
    });

    it("output-comments",async ()=>{
        const users = await data.loadUsers();
        const allThemes = await data.loadCommentDoc();

        //TODO - manually verify results
        
        const results = statsBuilder.buildLeagueTable(users,allThemes);
        expect(results.totalStories).to.equal(63);
        expect(results.totalThemes).to.equal(19);

        expect(results.users[0].user.id).to.equal("james");
        expect(results.users[1].user.id).to.equal("hannah");

        console.log(await statsBuilder.getAllCommentsAsArray(users,allThemes));
    });

    it("output-stories",async ()=>{
        const users = await data.loadUsers();
        const allThemes = await data.loadCommentDoc();


        console.log(await statsBuilder.getStoriesAsArray(users,allThemes));
    });

});