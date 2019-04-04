var expect = require('chai').expect;
const setup = require('./setup')();
const debug = require('debug')("test-data-methods");

describe('local-data-methods', function (){
    require('./_tests/_test-data-methods')(()=>setup.initLocalStorage('data-test-1'));
    
});

describe('local-data-methods-users', function (){
    require('./_tests/data-methods/_test-data-methods-user')(()=>setup.initLocalStorage('data-tests-users-1'));    
});

describe('local-data-methods-themes-and-stories', function (){
    require('./_tests/data-methods/_test-data-methods-themes-and-stories')(()=>setup.initLocalStorage('data-tests-themes-and-users-1'));
    
});

describe('local-data-methods-comments', function (){
    require('./_tests/data-methods/_test-data-methods-comments')(()=>setup.initLocalStorage('empty','data-tests-comments-1'));
    
});
describe ('helper-methods--data', function(){
    const data = require("../src/club/model/data")(null);
    it("group themes by year", function(){

        const groupedThemes = data.groupThemesByYear([
            {
                themeText: "one",
                deadline: "2026-01-01"
            },
            {
                themeText: "two",
                deadline: "2026-01-01"
            },
            {
                themeText: "three",
                deadline: "2020-01-01"
            },
            {
                themeText: "four",
                deadline: "2021-01-01"
            },
            {
                themeText: "five",
                deadline: "2021-01-01"
            },
            {
                themeText: "six",
                deadline: "2021-01-01"
            },
            {
                themeText: "seven",
                deadline: "2022-01-01"
            },
            {
                themeText: "seven"
            },
            {
                themeText: "eight"                
            },
        ]);

        
        expect(groupedThemes.length).to.equal(5);
        expect(groupedThemes[0].year).to.equal("2026");
        expect(groupedThemes[0].themes.length).to.equal(2);
        expect(groupedThemes[1].year).to.equal("2020");
        expect(groupedThemes[1].themes.length).to.equal(1);
        expect(groupedThemes[2].year).to.equal("2021");
        expect(groupedThemes[2].themes.length).to.equal(3);
        expect(groupedThemes[3].year).to.equal("2022");
        expect(groupedThemes[3].themes.length).to.equal(1);
        expect(groupedThemes[4].year).to.equal("sometime");
        expect(groupedThemes[4].themes.length).to.equal(2);

    });

    it("group stories by year", function(){

        const groupedThemes = data.groupStoriesByYear([
            {
                themeText: "one",
                deadline: "2026-01-01"
            },
            {
                themeText: "two",
                deadline: "2026-01-01"
            },
            {
                themeText: "three",
                deadline: "2020-01-01"
            },
            {
                themeText: "four",
                deadline: "2021-01-01"
            },
            {
                themeText: "five",
                deadline: "2021-01-01"
            },
            {
                themeText: "six",
                deadline: "2021-01-01"
            },
            {
                themeText: "seven",
                deadline: "2022-01-01"
            },
            {
                themeText: "seven"
            },
            {
                themeText: "eight"                
            },
        ]);

        
        expect(groupedThemes.length).to.equal(5);
        expect(groupedThemes[0].year).to.equal("2026");
        expect(groupedThemes[0].stories.length).to.equal(2);
        expect(groupedThemes[1].year).to.equal("2020");
        expect(groupedThemes[1].stories.length).to.equal(1);
        expect(groupedThemes[2].year).to.equal("2021");
        expect(groupedThemes[2].stories.length).to.equal(3);
        expect(groupedThemes[3].year).to.equal("2022");
        expect(groupedThemes[3].stories.length).to.equal(1);
        expect(groupedThemes[4].year).to.equal("sometime");
        expect(groupedThemes[4].stories.length).to.equal(2);

    });

});