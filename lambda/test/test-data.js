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
  var dataStorage = require('../src/club/storage/storage-local.js')({path:"_site/club/"});
  var htmlStorage = require('../src/club/storage/storage-local.js')({path:"_site/club/"});

  var themeController = require('../src/club/controllers/theme')(dataStorage,htmlStorage);
  await themeController.buildThemesPage();

} 

rebuildThemes();