const assert = require('assert');
require('dotenv').config({ path: 'variables.env' });
//console.log(process.env);
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});
async function dataLayerTests(dataLayer)
{

    await dataLayer.writeFile("file/something/here/1/i.json",JSON.stringify({path:'path1'}),"application/json");
    await dataLayer.writeFile("file/something/here/2/i.json",JSON.stringify({path:'path2'}),"application/json");
    await dataLayer.writeFile("file/something/here/am/page","<html/>","text/html"); 
    var thing = await dataLayer.readObjectFromJson("file/something/here/1/i.json");
    assert.equal("path1", thing.path);

    var things = await dataLayer.listObjectsFromJson("file/something/here");
    //console.log(things);
    assert.equal(2,things.length);
    assert.equal("path1",things[0].path);
    assert.equal("path2",things[1].path);

}

//dataLayerTests(require('../src/club/data-s3.js')({bucket:"www.storyclub.co.uk"}));

//dataLayerTests(require('../src/club/data-local.js')({path:"_site/unittest/"}));

async function rebuildThemes()
{
  var dataStorage = require('../src/club/storage/storage-s3.js')({bucket:"www.storyclub.co.uk"});
  var htmlStorage = require('../src/club/storage/storage-local.js')({path:"_site/club/"});

  var themeController = require('../src/club/controllers/theme')(dataStorage,htmlStorage);
  await themeController.buildThemesPage();

} 

//rebuildThemes();

function testGrouping()
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

  const groupedMap = items.reduce(
      (group, theme) => {
        let year = "sometime";
            if(theme.deadline)
            {
                year = theme.deadline.slice(0,4);
            }
            
            if(!group.has(year))
            {                
                group.set(year, new Set());             
            }
            group.get(year).add(theme);
            return group;
          },
      new Map()
  );

console.log(groupedMap);

console.log(Array.from(groupedMap.entries(),(entry)=>({year: entry[0], themes:Array.from(entry[1])})));

var something = null;
  return groupedMap;



}

//testGrouping();

async function testUsers()
{
  var storage = require('../src/club/model/data.js')(require('../src/club/storage/storage-local.js')({path:"_site/club/"}));
  console.log(await storage.loadUsers());
} 

//testUsers();