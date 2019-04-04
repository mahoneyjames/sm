'use strict';
let dataStorage = null;
let htmlStorage = null;
const codeRunner = require('./loggingHelper')("app-http");

if(process.env.DATA && process.env.DATA.toLowerCase()=="local")
{
    console.log("running locally");
    dataStorage = require('./storage/storage-local')({path:process.env.SITEPATH});
    htmlStorage = require('./storage/storage-local')({path:process.env.SITEPATH});
}
else
{
    console.log(`running with s3:${process.env.BUCKET}`);
    dataStorage = require('./storage/storage-s3')({bucket:process.env.BUCKET});
    htmlStorage = require('./storage/storage-s3')({bucket:process.env.BUCKET});    
}

const eventQueue = require('./eventQueue/htmlnow')(dataStorage,htmlStorage);
const data = require('./model/data')(dataStorage);
const html = require('./views/html')(htmlStorage);

//TODO - refactor the controller to data data and html, instead of storage
const themeController = require('./controllers/theme')(dataStorage,htmlStorage);

var ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder();

module.exports = api;

//Wrap up our gets and posts with a standard bit of logging
//Right now this grabs everything incoming and outgoing!
//There's probably a way to do this by using api.intercept, but for the moment this works
async function get(path, code)
{
    api.get(path, async function (request) {
        return await codeRunner.run(request, async (request)=> await code(request));
    }); 
}


async function post(path, code)
{
    api.post(path, async function (request) {
        return await codeRunner.run(request,async (request)=> await code(request));
    }); 
}

get('/hello', function (request) {
    return codeRunner.run(request, ()=>'hello world:' + process.env.BUCKET);
});

get('/hello2', function (request) {
    return 'hello world2:' + process.env.BUCKET;
});
get('/exception', function () {
  throw "aargh";
});


get('/api/themes/list', ()=>{    
    var model = require('./model/data')(dataStorage);
    return model.listThemes();
});

get('/api/themes/listEverything', ()=>{    
    var model = require('./model/data')(dataStorage);
    return model.listAllThemesAndStories();
});

get('/api/site/refreshStaticPages', async ()=>{    
    await require('./views/html')(htmlStorage).buildStaticPages();    
    return "done";
});


get('/api/site/refreshThemeList', async ()=>{    
    
    await themeController.buildThemesPage();
    return "done";
});


post('/api/site/publishThemeForReview', async (request)=>{    
    
    await themeController.publishThemeForReview(request.body.publicThemeId);
    return "done";
});

post('/api/site/closeTheme', async (request)=>{        
    await themeController.closeTheme(request.body.publicThemeId);
    return "done";
});

get('/api/site/home', async (request)=>{    
    var controller = require('./controllers/siteController')(data,html);
    await controller.rebuildHomePage();
    return "doned";
});


get('/api/site/no-comments', async (request)=>{    
    var controller = require('./controllers/siteController')(data,html);
    await controller.rebuildAuthorMissingCommentsPages();
    return "doned";
});

post('/api/themes/save', async (request)=>{
    
    var theme = await themeController.createThemeChallenge(request.body.theme);
    return theme;    
});

post('/api/themes/setLatest', async(request)=>{
    
    await themeController.setThemeAsLatest(request.body.publicThemeId);
});

post('/api/stories/save', async (request)=>{    
    
    var story = await themeController.previewStory(request.body.publicThemeId, request.body.story);
    return story;    
});



post('/api/users/save', async (request)=>{
   // console.log(request.body);

    var userController = require('./controllers/userController')(dataStorage,eventQueue);
    return await userController.saveUserData(request.body);
        
});
