
var expect = require('chai').expect;
//https://zaiste.net/modern_node_js_async_await_based_testing_with_mocha_chai/
//use before and beforeEach for setup?

module.exports = async function(storageForData, storageForHtml){   

    var module = {};

    var controller = require('../../src/club/controllers/theme')(storageForData,storageForHtml);

    describe('valid theme-full workflow', ()=>{

        var theme = {
            themeText:"unit test theme 1", 
            things:['thing 1', 'thing 2', 'thing 3'],
            deadline: '2019-01-01'
        };

        it('create theme',async ()=>{
            
            var savedTheme = await controller.createThemeChallenge(theme);
            //console.log(JSON.stringify(savedTheme));
            expect(savedTheme.errors.length).to.equal(0);

            });
    });

    return module;
}