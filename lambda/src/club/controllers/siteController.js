const logger = require("log2")("siteController");
const axios = require('axios');
const moment  = require("moment");
module.exports = function(data, html){

    var module = {};
    module.data = data;
    module.html = html;
    

    module.rebuildHomePage=async()=>{
        const latestTheme = await module.data.getLatestTheme();  
        const now = moment();
        const allPastThemes = (await module.data.cache_getThemesAndStories())
                                .filter(theme=>moment(theme.deadline).isBefore(now) || theme.status=="review" || theme.status=="complete");

        const recentThemes = module.data.sortThemesByDate(allPastThemes).slice(0,3); //get the 3 most recent...
        
        logger.track("themes").logThing(recentThemes);

        await module.html.buildHomePage(latestTheme,recentThemes);
    }

    return module;
}