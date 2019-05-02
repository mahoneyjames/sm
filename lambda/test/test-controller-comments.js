
var expect = require('chai').expect;
const setup = require('./setup')();

describe("controller-comments", function(){
    let storage = null;
    let controller = null;
    let data = null;
    before(async function()
    {
        storage = await setup.initLocalStorage("comments-controller-1");
        data = require("../src/club/model/data")(storage);
        controller = require("../src/club/controllers/commentsController")(data);
    });

    it("counts-for-themes", async function(){
        const results = await controller.getCommentCountsForThemes(['heart-warming', 'new-beginnings', 'theme7']);
        //console.log(results);

        expect(results.themes['heart-warming'].total).to.equal(1);
        expect(results.themes['new-beginnings'].total).to.equal(17);
        expect(results.themes.theme7.total).to.equal(0);
    });

    it("counts-for-stories-by-theme", async function(){
        const results = await controller.getCommentCountsForStoriesByTheme('new-beginnings');
                                                                            
        //console.log(results.themes);
        const theme = results.themes['new-beginnings'];
        expect(theme.total).to.equal(17);
        expect(theme.stories.newbeginnings.total).to.equal(3);
        expect(theme.stories.oreo.total).to.equal(3);
        expect(theme.stories.smut.total).to.equal(6);
        expect(theme.stories['toms-new-start'].total).to.equal(1);
        expect(theme.stories['who-is-she-or-everyone-loves-a-box-of-puppies.'].total).to.equal(4);
    });

    it("list-recent-comments", async function(){
        const comments = await controller.listRecentComments(5);
        //console.log(comments);
        expect(comments.length).to.equal(5);
        expect(comments[0].themeId).to.equal("heart-warming");
        expect(comments[0].storyPublicId).to.equal("boots");
        expect(comments[0].storyTitle).to.equal("Boots");
        expect(comments[0].storyPath).to.equal("h/heart-warming/boots");
        expect(comments[0].userId).to.equal("jenny");
        expect(comments[0].when).to.equal("2019-03-19T15:10:18");
        expect(comments[0].whenFromNow.includes("month")).to.equal(true);
        expect(comments[0].html).to.equal("<p>I'm a bit confused - what's the connection with Boots and Maggie to the wife and kid in hospital? Fills the heartwarming theme well, and the opening line is brutal - really impactful!</p>");

    })

    it("reset-cache", async function(){
        expect(data.cache.comments.comments.length).to.equal(18);
        controller.resetCommentCache();
        expect(data.cache.comments).to.be.null;

        //make sure our resetting of the cache hasn't broken stuff
        const comments = await data.cache_getAllComments();
        expect(comments.comments.length).to.equal(18);
    });
});