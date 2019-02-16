require('dotenv').config({ path: 'variables.env' });

//console.log(process.env.AWS_SECRET);
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

async function blah()
{    
    //const storage = (require('./src/club/storage/storage-s3.js')({bucket:process.env.BUCKET}));
    const storage = require('./src/club/storage/storage-local.js')({path:"_site/club/"});
    const disqusController = require('./src/club/controllers/disqusController')(process.env.disqus_accessToken, process.env.disqus_apiKey, process.env.disqus_apiSecret, "storyclub",storage,storage);


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
    //console.log(await disqusController.getCommentLeagueTable());
    for(const position of (await disqusController.getCommentLeagueTable()).users)
    {
            //console.log(user);
        console.log(`${position.user.id}\t${position.totalComments}\t\t${position.totalStories}`);
    }

    await disqusController.generateCommentLeagueTablePage();
    

}

//blah();


function reporting()
{
    var items = [ 
    { deadline: "2019-01-01", Step: "Step 1", Task: "Task 1", Value: "5" },
    { deadline: "2018-01-01", Step: "Step 1", Task: "Task 2", Value: "10" },
    { deadline: "2017-01-01", Step: "Step 2", Task: "Task 1", Value: "15" },
    { deadline: "2017-01-01", Step: "Step 2", Task: "Task 2", Value: "20" },
    { deadline: "2018-01-01", Step: "Step 1", Task: "Task 1", Value: "25" },
    { deadline: "2017-01-01", Step: "Step 1", Task: "Task 2", Value: "30" },
    { deadline: "2019-01-01", Step: "Step 2", Task: "Task 1", Value: "35" },
    { deadline: "2019-01-01", Step: "Step 2", Task: "Task 2", Value: "40" }
    ];

    const dataForge = require('data-forge');
    const transformedData = new dataForge.DataFrame(items)
                            .parseFloats("Value")
                            .orderBy(row=>row.deadline)
                            .groupBy(row=>row.deadline)
                            .select(group=>({
                                deadline: group.first().deadline, 
                                count: group.count(),
                                total: group.deflate(row=>row.Value).sum()
                            }))
                            .toArray();
    console.log(transformedData);

}

reporting();