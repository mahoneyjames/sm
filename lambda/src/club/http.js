'use strict';
let dataStorage = null;
let htmlStorage = null;

console.log(`pwd:${process.cwd()}`);
const claudiaHelper = require("lambda-helpers")("app-v1");

if(process.env.DATA && process.env.DATA.toLowerCase()=="local")
{
    console.log("running locally");
    dataStorage = require('storage-1').local({path:process.env.SITEPATH});
    htmlStorage = require('storage-1').local({path:process.env.SITEPATH});
}
else
{
    console.log(`running with s3:${process.env.BUCKET}`);
    dataStorage = require('storage-1').s3({bucket:process.env.BUCKET});
    htmlStorage = require('storage-1').s3({bucket:process.env.BUCKET});    
}

const eventQueue = require('./eventQueue/htmlnow')(dataStorage,htmlStorage);
const data = require('./model/data')(dataStorage);
const html = require('storyclub-views')(htmlStorage,"./src/club/views");

console.log(html.viewHome);
const themeController = require('./controllers/theme')(data,html);

var ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder();

module.exports = api;

claudiaHelper.get(api, '/hello', async ()=>'hello world:' + process.env.BUCKET);
claudiaHelper.get(api, '/hello2', async () =>'hello world2:' + process.env.BUCKET);
claudiaHelper.get(api, '/exception', async () =>{ throw "aargh";});
claudiaHelper.get(api,'/api/themes/list', async ()=>data.cache_listThemes());
claudiaHelper.get(api,'/api/themes/listEverything', async ()=>data.cache_getThemesAndStories());
claudiaHelper.get(api,'/api/themes/listRecentEverything', async ()=>data.cache_getThemesAndStoriesRecentEverything());

claudiaHelper.get(api,'/api/site/refreshStaticPages', async ()=>{    
    await html.buildStaticPages();    
    return {"result":"done"};
});

claudiaHelper.get(api,'/api/cache/reset', async ()=>{
    data.resetCache();
    return {};
});

claudiaHelper.get(api,'/api/site/refreshThemeList', async ()=>{    
    await themeController.buildThemesPage();
    return {result:"done"};
});


claudiaHelper.post(api, '/api/site/publishThemeForReview', async (request)=>{    
    return {        
        theme:  await themeController.publishThemeForReview(request.body.publicThemeId),
        action:"publishThemeForReview", 
        status:"success"
    };
});

claudiaHelper.post(api, '/api/site/closeTheme', async (request)=>{        
    return {
        theme: await themeController.closeTheme(request.body.publicThemeId),
        action:"closeTheme",
        status:"success"};
    
});

claudiaHelper.post(api, '/api/site/rebuildTheme', async (request)=>{        
    await themeController.rebuildThemePage(request.body.publicThemeId);
    return {action:"rebuildTheme", publicThemeId:request.body.publicThemeId, result:"success"};
});

claudiaHelper.get(api,'/api/site/home', async (request)=>{    
    var controller = require('./controllers/siteController')(data,html);
    await controller.rebuildHomePage();
    return {result:"done"};
});


claudiaHelper.get(api,'/api/site/no-comments', async (request)=>{    
    var controller = require('./controllers/siteController')(data,html);
    await controller.rebuildAuthorMissingCommentsPages();
    return {result:"done"};
});

claudiaHelper.post(api, '/api/themes/save', async (request)=>{
    
    var theme = await themeController.createThemeChallenge(request.body.theme);
    return theme;    
});

claudiaHelper.post(api, '/api/themes/setLatest', async(request)=>{
    
    await themeController.setThemeAsLatest(request.body.publicThemeId);
    return {result:"done"};
});

claudiaHelper.post(api, '/api/stories/save', async (request)=>{    
    
    var story = await themeController.previewStory(request.body.publicThemeId, request.body.story);
    return story;    
});

claudiaHelper.post(api, '/api/users/save', async (request)=>{   
    var userController = require('./controllers/userController')(dataStorage,eventQueue);
    return await userController.saveUserData(request.body);
        
});
