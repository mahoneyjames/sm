const debug = require('debug')("test-data-helpers");
const expect = require('chai').expect;
const setup = require('./setup')();
const {groupStoriesByAuthor} = require("../src/club/model/data-helpers");

describe("data-helpers", function(){
   
    it("groupStoriesByAuthor", function(){
        const themesAndStories = [
            {themeText:"theme1", stories:[
                {id:"story1", author:"James"},
                {id:"story2", author:"Jenny"},
                {id:"story3", author:"JLewis"}
            ]},
            {themeText:"theme2", stories:[
                {id:"story4", author:"James"},
                {id:"story5", author:"Dan"},
                {id:"story6", author:"Hannah"}
            ]},
            {themeText:"theme3", stories:[
                {id:"story7", author:"Liz"},
                {id:"story8", author:"Jenny"},
                {id:"story9", author:"James"}
            ]}
        ];

        const results = groupStoriesByAuthor(themesAndStories);
        console.log(results);

        expect(results.james.stories.length).to.equal(3);
        expect(results.jenny.stories.length).to.equal(2);
        expect(results.jlewis.stories.length).to.equal(1);
        expect(results.dan.stories.length).to.equal(1);
        expect(results.liz.stories.length).to.equal(1);
        expect(results.hannah.stories.length).to.equal(1);

    })
    
});