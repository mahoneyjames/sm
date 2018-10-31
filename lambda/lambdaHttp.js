const dataStorage = require('./src/club/storage/storage-local')({path:"_site/club/"});
const htmlStorage = require('./src/club/storage/storage-local')({path:"_site/club/"});

// const dataStorage = require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET});
// const htmlStorage = require('./src/club/storage/storage-s3')({bucket:process.env.BUCKET});

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
                        
        case "sc-echo":
            return event;
        default:
            return "dim byd!";
    }

}