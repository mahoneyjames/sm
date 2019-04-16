const expect = require('chai').expect;
const debug = require('debug')("test-helpers-comments");
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


const bunchOComments = [
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4384825025",
        "userId": "lewis",
        "text": "<p>I thought that might be the case!! But good to know it was intentional. <a href=\"https://disq.us/url?url=https%3A%2F%2Fmedia0.giphy.com%2Fmedia%2FwIwrQ3umuEuM8%2Fgiphy.gif%3AgwBcs3fCddbvmohIS3bcPH7XTvs&amp;cuid=5601311\" rel=\"nofollow noopener\" title=\"https://media0.giphy.com/media/wIwrQ3umuEuM8/giphy.gif\">https://media0.giphy.com/me...</a></p>",
        "when": "2019-03-19T08:06:08",
        "parentId": 4379215498
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4384824485",
        "userId": "lewis",
        "text": "lewis-dan-lewis-1",
        "when": "2019-03-19T08:05:10",
        "parentId": 4379232859
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4379232859",
        "userId": "dan",
        "text": "dan-answer-1",
        "when": "2019-03-15T08:03:46",
        "parentId": 4378628826
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4379216695",
        "userId": "dan",
        "text": "<p>the pergola was nothing just a thing i had to collect from a suburban house once that seemed to fit the style and took up only one word, i felt i had to explain what she was doing there.</p>",
        "when": "2019-03-15T07:36:48",
        "parentId": 4378622646
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4379215498",
        "userId": "dan",
        "text": "<p>you will see the exclamation marks are in character because there are few if any in the second half.</p>",
        "when": "2019-03-15T07:34:51",
        "parentId": 4378625042
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4378628826",
        "userId": "lewis",
        "text": "<p>Also What is the teeth of Rylan? :)</p>",
        "when": "2019-03-14T20:31:54",
        "parentId": null
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4378625042",
        "userId": "lewis",
        "text": "lewis-comment-2",
        "when": "2019-03-14T20:29:22",
        "parentId": null
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4378622646",
        "userId": "jenny",
        "text": "jenny-comment-1",
        "when": "2019-03-14T20:27:43",
        "parentId": null
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4378615398",
        "userId": "jenny",
        "text": "<p>This wasn't me!</p>",
        "when": "2019-03-14T20:22:53",
        "parentId": null
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4377950602",
        "userId": "dan",
        "text": "hannah-dan-hannah-dan",
        "when": "2019-03-14T12:52:43",
        "parentId": 4377915229
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4377915229",
        "userId": "hannah",
        "text": "hannah-dan-hannah",
        "when": "2019-03-14T12:21:17",
        "parentId": 4377793164
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4377854587",
        "userId": "helen",
        "text": "<p>This has GOT to be Jenny! I really liked it ... think it's because deep down I like the idea of getting revenge!</p>",
        "when": "2019-03-14T11:17:02",
        "parentId": null
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4377793164",
        "userId": "dan",
        "text": "<p>eg character 2 has Jenny's circs!! to name but one. though she is not jenny.</p>",
        "when": "2019-03-14T10:03:40",
        "parentId": 4377792047
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4377792047",
        "userId": "dan",
        "text": "hannah-dan",
        "when": "2019-03-14T10:02:04",
        "parentId": 4377732106
    },
    {
        "themeId": "the-suburbs",
        "storyId": "140gux1jt7a6qdm",
        "storyPublicId": "suburban-flight",
        "storyTitle": "Suburban Flight",
        "id": "4377732106",
        "userId": "hannah",
        "text": "hannah-comment-1",
        "when": "2019-03-14T08:30:51",
        "parentId": null
    },
    {
        "themeId": "admonishing",
        "storyId": "1c9lz1jr8uqla5",
        "storyPublicId": "a-warm-welcome",
        "storyTitle": "A warm welcome",
        "id": "4348071872",
        "userId": "lewis",
        "text": "<p>In-laws hey! I was expecting a bit more of a twist for this one. But it was well written and characters were quite honest. I was jus hoping for something extra at the end.</p>",
        "when": "2019-02-21T16:48:53",
        "parentId": null
    },
    {
        "themeId": "admonishing",
        "storyId": "1c9lz1jr8uqla5",
        "storyPublicId": "a-warm-welcome",
        "storyTitle": "A warm welcome",
        "id": "4309947690",
        "userId": "hannah",
        "text": "<p>Love the dynamic here it feels very real. The characters are well developed given the brevity. James’ Mum particularly from the first twitch of the curtain up to the victorious smirk!</p>",
        "when": "2019-01-27T20:50:28",
        "parentId": null
    }  ,
    {
        "themeId": "jane-austen",
        "storyId": "33mde1jsyc8uoj",
        "storyPublicId": "diamonds-are-for-emma",
        "storyTitle": "Diamonds are for Emma",
        "id": "4384926169",
        "userId": "james",
        "text": "<p>I like the idea - a dwarf taking to the skies so they no longer feel out of place.</p><p>The gags were shoe horned in just to get the Jane austen theme kind of barely met!</p>",
        "when": "2019-03-19T10:48:17",
        "parentId": 4384827539
    },
    {
        "themeId": "jane-austen",
        "storyId": "33mde1jsyc8uoj",
        "storyPublicId": "diamonds-are-for-emma",
        "storyTitle": "Diamonds are for Emma",
        "id": "4384827539",
        "userId": "lewis",
        "text": "<p>This was fun. The comedy docking and going to town on Lady Susan was funny but did jar a little as I don’t think it was as funny as perhaps it was intended. Not in a bad way. But I kind of found it a bit sad rather than ridiculous if that makes sense?</p>",
        "when": "2019-03-19T08:10:43",
        "parentId": null
    },
    {
        "themeId": "jane-austen",
        "storyId": "33mde1jsyc8uoj",
        "storyPublicId": "diamonds-are-for-emma",
        "storyTitle": "Diamonds are for Emma",
        "id": "4369309430",
        "userId": "hannah",
        "text": "<p>I loved this - absolute genius! Dan the school kids were her circus pals in disguise! I’m usually easily confused but totally got this. Some lovely lines and well structured - the alternation between narrative and context is very smooth and well balanced</p>",
        "when": "2019-03-08T09:04:20",
        "parentId": null
    },
    {
        "themeId": "jane-austen",
        "storyId": "33mde1jsyc8uoj",
        "storyPublicId": "diamonds-are-for-emma",
        "storyTitle": "Diamonds are for Emma",
        "id": "4367888353",
        "userId": "dan",
        "text": "<p>Love the ending, the tone, the idea and the austenesque puns. There are tipos and words astray in the middle I think which makes it hard to follow the plot and I’m a bit confused between the circus dwarves the children fighting etc perhaps I’ve misunderstood. One of those could be brill but might have needed better editing?</p>",
        "when": "2019-03-07T10:35:55",
        "parentId": null
    },
    {
        "themeId": "jane-austen",
        "storyId": "v20jr1jsxiz739",
        "storyPublicId": "beebland",
        "storyTitle": "Beebland",
        "id": "4369343036",
        "userId": "dan",
        "text": "<p>Deliberate pun on “snuggling “</p>",
        "when": "2019-03-08T09:58:42",
        "parentId": 4369323699
    },
    {
        "themeId": "jane-austen",
        "storyId": "v20jr1jsxiz739",
        "storyPublicId": "beebland",
        "storyTitle": "Beebland",
        "id": "4369323699",
        "userId": "hannah",
        "text": "<p>Ha ha very funny and clever. The poldark paragraph has an amusing typo, unless smuggling is the new spooning. Glad he got his gal in the end.</p>",
        "when": "2019-03-08T09:27:44",
        "parentId": null
    },
    {
        "themeId": "jane-austen",
        "storyId": "v20jr1jsxiz739",
        "storyPublicId": "beebland",
        "storyTitle": "Beebland",
        "id": "4367786189",
        "userId": "james",
        "text": "<p>Very clever, bravo!</p>",
        "when": "2019-03-07T07:55:26",
        "parentId": null
    },
    {
        "themeId": "jane-austen",
        "storyId": "v20jr1jsxiz9oi",
        "storyPublicId": "bride-unprejudiced",
        "storyTitle": "Bride Unprejudiced",
        "id": "4385103995",
        "userId": "jenny",
        "text": "<p>Twas I! well done!</p>",
        "when": "2019-03-19T13:46:02",
        "parentId": 4369326894
    },
    {
        "themeId": "jane-austen",
        "storyId": "v20jr1jsxiz9oi",
        "storyPublicId": "bride-unprejudiced",
        "storyTitle": "Bride Unprejudiced",
        "id": "4369326894",
        "userId": "hannah",
        "text": "<p>This is an absolute corker - the names are ridiculously funny and the plot is wonderful. Nice tone and language. I love how in the moment it all is too. Too marks to the mystery author (jenny?)</p>",
        "when": "2019-03-08T09:33:07",
        "parentId": null
    },
    {
        "themeId": "jane-austen",
        "storyId": "v20jr1jsxiz9oi",
        "storyPublicId": "bride-unprejudiced",
        "storyTitle": "Bride Unprejudiced",
        "id": "4367762702",
        "userId": "dan",
        "text": "<p>Haha love it!</p>",
        "when": "2019-03-07T07:16:48",
        "parentId": null
    },
    {
        "themeId": "uninhibited",
        "storyId": "2m8h1jsdbi1yu",
        "storyPublicId": "jake",
        "storyTitle": "Jake",
        "id": "4405529706",
        "userId": "lewis",
        "text": "<p>This is very tragic but beautiful in its own way. But I loved the way her life unfolds. The mother rings very true as well. Very bittersweet. I don’t think the meat factory section needs to be there it’s a bit too funny if that makes sense. But the emotional journey is really interesting and a great take on the theme.</p>",
        "when": "2019-04-01T22:41:48",
        "parentId": null
    },
    {
        "themeId": "uninhibited",
        "storyId": "2m8h1jsdbi1yu",
        "storyPublicId": "jake",
        "storyTitle": "Jake",
        "id": "4353294351",
        "userId": "helen",
        "text": "<p>I loved this as Hannah mentioned it showed the different emotions of dealing with a child with serious illness. I liked that, the end, she'd come to be thankful for her past life but also grateful to her son for changing her life too.</p>",
        "when": "2019-02-25T13:12:29",
        "parentId": null
    },
    {
        "themeId": "uninhibited",
        "storyId": "2m8h1jsdbi1yu",
        "storyPublicId": "jake",
        "storyTitle": "Jake",
        "id": "4347730331",
        "userId": "dan",
        "text": "<p>But yes I think it’s a sort of hysteria</p>",
        "when": "2019-02-21T12:56:19",
        "parentId": 4347677129
    },
    {
        "themeId": "uninhibited",
        "storyId": "2m8h1jsdbi1yu",
        "storyPublicId": "jake",
        "storyTitle": "Jake",
        "id": "4347729018",
        "userId": "dan",
        "text": "<p>I think she is probably relieved at the self realisation which is hard to describe I guess in the words. Abd maybe her laughter is one memory of a great moment that crystal uses everything but I truly wrote through this one in one go. So I agree the last paragraph is not quite right</p>",
        "when": "2019-02-21T12:54:58",
        "parentId": 4347677129
    },
    {
        "themeId": "uninhibited",
        "storyId": "2m8h1jsdbi1yu",
        "storyPublicId": "jake",
        "storyTitle": "Jake",
        "id": "4347677129",
        "userId": "hannah",
        "text": "<p>Very very sad. The journey of emotions resentment, anger, nostalgia, sadness and (bitter? Or maybe hysterical? I can’t believe she’s simply amused at the realisation, feels more like the kind laugh you’d get when you’ve gone beyond the ‘normal’ range of emotions...) laughter is a great way to structure the piece.</p>",
        "when": "2019-02-21T11:58:43",
        "parentId": null
    },
    {
        "themeId": "uninhibited",
        "storyId": "2m8h1jsdbi1yu",
        "storyPublicId": "jake",
        "storyTitle": "Jake",
        "id": "4347465461",
        "userId": "dan",
        "text": "<p>I’m so inhibited I didn’t even think of nudity</p>",
        "when": "2019-02-21T06:54:05",
        "parentId": 4347007798
    },
    {
        "themeId": "uninhibited",
        "storyId": "2m8h1jsdbi1yu",
        "storyPublicId": "jake",
        "storyTitle": "Jake",
        "id": "4347007798",
        "userId": "james",
        "text": "<p>A refreshing change from all the rest of us who charged headlong at nudity for the uninhibited theme. I like where you took this.</p>",
        "when": "2019-02-20T22:33:03",
        "parentId": null
    }          
];

describe("test-data-helpers-comments", function(){

    it("build-tree", function(){

        const {convertCommentArrayToTree} = require("../src/club/model/comment/commentHelpers");

        const result = convertCommentArrayToTree(bunchOComments);


        //console.log(result);

        expect(result.storyList.length).to.equal(6);

        
        const suburbanFlight = result.storiesById['suburban-flight'];
        expect(suburbanFlight.comments.length).to.equal(6);
        //console.log(suburbanFlight);

        expect(suburbanFlight.comments[0].userId).to.equal("lewis");
        expect(suburbanFlight.comments[0].text).to.equal("<p>Also What is the teeth of Rylan? :)</p>");
            //console.log(suburbanFlight.comments[0].comments);
            expect(suburbanFlight.comments[0].comments[0].userId).to.equal("dan");
            expect(suburbanFlight.comments[0].comments[0].text).to.equal("dan-answer-1");

                //console.log(suburbanFlight.comments[0].comments[0]);
                expect(suburbanFlight.comments[0].comments[0].comments[0].text).to.equal("lewis-dan-lewis-1");

                expect(suburbanFlight.comments[0].comments[0].comments[0].comments.length).to.equal(0);

        

        expect(suburbanFlight.comments[1].userId).to.equal("lewis");
        expect(suburbanFlight.comments[1].text).to.equal("lewis-comment-2");

        expect(suburbanFlight.comments[2].userId).to.equal("jenny");
        expect(suburbanFlight.comments[2].text).to.equal("jenny-comment-1");

        expect(suburbanFlight.comments[3].userId).to.equal("jenny");
        expect(suburbanFlight.comments[3].text).to.equal("<p>This wasn't me!</p>");

        expect(suburbanFlight.comments[4].userId).to.equal("helen");


        expect(suburbanFlight.comments[5].userId).to.equal("hannah");
        expect(suburbanFlight.comments[5].text).to.equal("hannah-comment-1");

        //console.log(suburbanFlight.comments[5].comments[0].comments[0].comments[0].comments);
            expect(suburbanFlight.comments[5].comments[0].text).to.equal("hannah-dan");

                expect(suburbanFlight.comments[5].comments[0].comments[0].text).to.equal("<p>eg character 2 has Jenny's circs!! to name but one. though she is not jenny.</p>");

                expect(suburbanFlight.comments[5].comments[0].comments[0].comments[0].text).to.equal("hannah-dan-hannah");
                    expect(suburbanFlight.comments[5].comments[0].comments[0].comments[0].comments[0].text).to.equal("hannah-dan-hannah-dan");

        const jake = result.storiesById.jake;
        //console.log(jake);
        expect(jake.comments[2].comments.length).to.equal(2);
    });
});


describe("data-helpers-comments-add-to-stories", function()
{
    it("add-comments-to-stories", function(){
        const {addCommentsToStories}  = require("../src/club/model/comment/commentHelpers");
        const stories =[{publicId:"suburban-flight"}, {publicId: "a-warm-welcome"}, {publicId:"story-with-no-comments"}];
        
        addCommentsToStories(stories, bunchOComments);
        console.log(stories);

        expect(stories[0].comments.length).to.equal(6);
        expect(stories[1].comments.length).to.equal(2);
        expect(stories[2].comments.length).to.equal(0);


    });
});