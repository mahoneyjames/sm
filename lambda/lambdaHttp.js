let dataStorage = null;
let htmlStorage = null;

if(process.env.DATA && process.env.DATA.toLowerCase()=="local")
{
    console.log("running locally");
    dataStorage = require('./src/club/storage/storage-local')({path:"_site/club/"});
    htmlStorage = require('./src/club/storage/storage-local')({path:"_site/club/"});
}
else
{
    console.log(`running with s3:${process.env.BUCKET}`);
    dataStorage = require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET});
    htmlStorage = require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET});
}



const themeController = require('./src/club/controllers/theme')(dataStorage,htmlStorage);



exports.genericFunction = async(event, context)=>{
    switch(event.action)
    {
        case "sc-story":
            return await themeController.previewStory(event.publicThemeId, event.story);
        case "sc-theme-new":
            return await themeController.createThemeChallenge(event.theme);
        case "sc-theme-publish":
            return await themeController.publishThemeForReview(event.publicThemeId);

        case "sc-themes":
            return await themeController.buildThemesPage();
        
        case "sc-static":
            return await require('./src/club/views/html')(htmlStorage).buildStaticPages();

        case "sc-echo":
            return event;
        default:
            return "dim byd!";
    }

}