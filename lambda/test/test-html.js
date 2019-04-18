const expect = require('chai').expect;
const debug = require('debug')("test-html");

function getStorage(path)
{
    return require("../src/club/storage/storage-local")({path});
}

function getDataStorage(path="_site/club/data")
{
    return getStorage(path);
}
function getHtmlStorage(path="_site/club/")
{
    return getStorage(path);
}

function getHtmlBuilder(storage)
{
    return require("../src/club/views/html")(storage);
}

/*
    "tests" to allow us to test html building without having to run the whole site. 
*/

describe("html-theme", function(){


    it("with-comments", async function(){
        const builder = getHtmlBuilder(getHtmlStorage());

        const stories = [
            getStory("theme-manual","manual-story-id-1", "test-story-1-uyeiwruoweru","Title for story 1",getUser("james")),
            getStory("theme-manual","manual-story-id-2", "test-story-2-opuoewiruoiweuroie","Title for story 2", getUser("jenny")),
            getStory("theme-manual","manual-story-id-3", "test-story-3-adsfkajdfja","Title for story 3",getUser("lewis"))
            ];

        stories[0].comments = [getComment("theme-manual", stories[0], "dan", "nice story!"),
                            getComment("theme-manual", stories[0], "hannah", "yes, it's fabulous")]

        stories[2].comments = [getComment("theme-manual", stories[2], "jenny", "I don't understand"),
                                getComment("theme-manual", stories[2], "lewis", "I smell")]                            

        await builder.buildThemeNavigation(getTheme("theme-manual","manual theme"),stories,true,[])

    });
});

function getUser(id)
{
    return {id, publicId: id, name:id};
}
function getTheme(publicId,text)
{
    return {publicId,text, things:["thing 1", "thing 2", "thing 3"]};
}

function getStory(publicThemeId, storyPublicId, storyId, title, user,comments=[])
{
    const story= {publicThemeId, publicId:storyPublicId, id:storyId, storyId, title, authorUser: user, comments, html: "<div>" + publicThemeId + "</div><div>" + storyPublicId + "</div><div>" + user.name + "</div>"};
    console.log(story);
    return story;
}

function getComment(publicThemeId, story, userId, text)
{
    return {themeId:publicThemeId, storyId:story.storyId, storyPublicId:story.publicStoryId, storyTitle: story.title, userId, text};
}