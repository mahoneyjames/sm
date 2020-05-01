const logger = require("log2")("siteController");
const axios = require('axios');
module.exports = function(data, html){

    var module = {};
    module.data = data;
    module.html = html;
    

    module.rebuildHomePage=async()=>{
        const latestTheme = await module.data.getLatestTheme();        
        const recentThemes = await module.data.sortThemesByDate((await module.data.cache_getThemesAndStories())).slice(1,4); //get the 3 most recent...
        
        logger.track("themes").logThing(recentThemes);

        await module.html.buildHomePage(latestTheme,recentThemes);
    }

    return module;
}