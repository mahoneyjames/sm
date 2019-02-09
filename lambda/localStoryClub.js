require('dotenv').config({ path: 'variables.env' });

//console.log(process.env.AWS_SECRET);
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

async function blah()
{    
    //const dataLayer = require('./src/club/model/data')(require('./src/club/storage/storage-s3.js')({bucket:process.env.BUCKET}));
    const dataLayer = require('./src/club/model/data')(require('./src/club/storage/storage-local.js')({path:"_site/club/"}));
    const disqusController = require('./src/club/controllers/disqusController')(process.env.disqus_accessToken, process.env.disqus_apiKey, process.env.disqus_apiSecret, "storyclub",dataLayer);


    // const themes = await dataLayer.listThemes();
    // for (theme of themes)
    // {        

    //     const stories = await dataLayer.listThemeStories(theme.publicId);
    //     console.log(theme.publicId);
    //     for(story of stories)
    //     {
    //         console.log(story.id);
    //         console.log( await disqusController.listStoryComments(story.id));
    //     }
    // }
    
    //console.log(await disqusController.generateCommentDoc());
    console.log("user\tcomments\tstory count")
    console.log("----\t--------\t-----------")
    for(const position of await disqusController.getCommentLeagueTable())
    {
            //console.log(user);
        console.log(`${position.user.id}\t${position.totalComments}\t\t${position.totalStories}`);
    }
    

}

blah();