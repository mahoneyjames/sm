const debug = require('debug')("test-stats-comments");
var expect = require('chai').expect;
const setup = require('./setup')();

describe ("stats-comments-manual", async ()=>{

    const storage = await setup.initLocalStorage('stats-tests/1');
    const data = require('../src/club/model/data')(storage);
    const statsBuilder = require('../src/club/model/stats')();


    it("stats1",async ()=>{
        const users = await data.loadUsers();
        const allThemes = await data.loadCommentDoc();

        //TODO - manually verify results
        
        const results = statsBuilder.buildLeagueTable(users,allThemes);
        expect(results.totalStories).to.equal(63);
        expect(results.totalThemes).to.equal(19);

        expect(results.users[0].user.id).to.equal("james");
        expect(results.users[1].user.id).to.equal("hannah");

        debug("use\ttotal\tdisqus\tone month");
        for(const user of results.users)
        {
            debug(`${user.user.id}\t${user.totalStoriesSinceJoined}\t${user.totalStoriesSinceDisqus}\t${user.totalStoriesLastTwoMonths}`);
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

        debug(await statsBuilder.getAllCommentsAsArray(users,allThemes));
    });

    it("output-stories",async ()=>{
        const users = await data.loadUsers();
        const allThemes = await data.loadCommentDoc();


        debug(await statsBuilder.getStoriesAsArray(users,allThemes));
    });

});