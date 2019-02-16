'use strict';
let dataStorage = null;
let htmlStorage = null;
console.log("here");
if(process.env.DATA && process.env.DATA.toLowerCase()=="local")
{
    console.log("running locally");
    dataStorage = require('./storage/storage-local')({path:"_site/club/"});
    htmlStorage = require('./storage/storage-local')({path:"_site/club/"});
}
else
{
    console.log(`running with s3:${process.env.BUCKET}`);
    dataStorage = require('./storage/storage-s3')({bucket:process.env.BUCKET});
    htmlStorage = require('./storage/storage-s3')({bucket:process.env.BUCKET});    
}

var ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder();

module.exports = api;

api.get('/hello', function () {
  return 'hello world';
});

api.get('/exception', function () {
  throw "aargh";
});


api.get('/api/themes/list', ()=>{    
    var model = require('./model/data')(dataStorage);
    return model.listThemes();
});

api.get('/api/site/refreshStaticPages', async ()=>{    
    await require('./views/html')(htmlStorage).buildStaticPages();    
    return "done";
});


api.get('/api/site/refreshThemeList', async ()=>{    
    var themeController = require('./controllers/theme')(dataStorage,htmlStorage);
    await themeController.buildThemesPage();
    return "done";
});



api.post('/api/site/publishThemeForReview', async (request)=>{    
    var themeController = require('./controllers/theme')(dataStorage,htmlStorage);
    await themeController.publishThemeForReview(request.body.publicThemeId);
    return "done";
});

api.post('/api/site/closeTheme', async (request)=>{    
    var themeController = require('./controllers/theme')(dataStorage,htmlStorage);
    await themeController.closeTheme(request.body.publicThemeId);
    return "done";
});

api.get('/api/site/home', async (request)=>{    
    var controller = require('./controllers/siteController')(dataStorage,htmlStorage);
    await controller.rebuildHomePage();
    return "done";
});

api.post('/api/themes/save', async (request)=>{
    console.log(request.body);
    var themeController = require('./controllers/theme')(dataStorage,htmlStorage);
    var theme = await themeController.createThemeChallenge(request.body.theme);
    return theme;    
});

api.post('/api/themes/setLatest', async(request)=>{
    var themeController = require('./controllers/theme')(dataStorage,htmlStorage);
    await themeController.setThemeAsLatest(request.body.publicThemeId);
});

api.post('/api/stories/save', async (request)=>{
    console.log(request.body);
    var themeController = require('./controllers/theme')(dataStorage,htmlStorage);
    var story = await themeController.previewStory(request.body.publicThemeId, request.body.story);
    return story;    
});


api.get('/api/comments/sync', async (request)=>{
    const disqusController = require('./controllers/disqusController')
    (process.env.disqus_accessToken, 
        process.env.disqus_apiKey, 
        process.env.disqus_apiSecret,
        process.env.disqus_forum,
        dataStorage,
        htmlStorage);

    return await disqusController.syncAllComments();
});