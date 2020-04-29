const {copy} = require('fs-extra');
const debug = require('debug')("test-setup");
const moment = require('moment');

//Not sure if this is the correct way to do it, but I want a single root folder for all tests that were run 
//at one time. 
//This class set up a single root folder for each test run, and then supports
//copying all source files for a given test into a child folder 

//This allows us a simple way to run tests with a set of known data, without having to define methods to
//clean things up first
let defaultTestContext = null;


module.exports = function(options={})
{
    var module = {};
    const {testsFolder='test/_test-runs', 
            inputDataFolder='test/inputs'} = options;
    
            if(defaultTestContext==null)
            {
                defaultTestContext = {
                    testRunFolder : `${testsFolder}/${moment().format("YYYY-MM-DDTHH-mm-ss")}`
                };
                debug("Test run folder is '%s'", defaultTestContext.testRunFolder);
            }

    
    module.initLocalStorage = async(sourceFolder, testKey)=>
    {
        if(testKey==null){
            testKey = sourceFolder;
        }
        const sourcePath = `${inputDataFolder}/${sourceFolder}`;
        const targetPath = `${defaultTestContext.testRunFolder}/${testKey}/`;
        debug(`Copying contents from '%s' to '%s'`, sourcePath, targetPath);

        await copy(sourcePath, targetPath);
        return require('storage-1').local({path:targetPath});
    }

    return module;
}


