var expect = require('chai').expect;
module.exports = async function(storageLoader){   

    var module = {};

    let data = null;
    let storage = null;

    before(async function(){
        storage = await storageLoader();
        data = require('../../../src/club/model/data')(storage);
    });

}