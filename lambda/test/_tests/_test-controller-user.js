var expect = require('chai').expect;
const uniqid = require('uniqid');

module.exports = async function(storageLoader){   

    var module = {};

    const eventQueue = require('../../src/club/eventQueue/array')();
    
    //clear the storage before running?

    describe("controller-user-save", ()=>
    {
        let data = null;
        let storageForData = null;
        let controller = null;
        before(async function(){

            
           storageForData = await storageLoader();            
            controller = require('../../src/club/controllers/userController')(storageForData,eventQueue);
        });
        

            it("no-users", async ()=>{
                const results = await controller.saveUserData({});

                expect(eventQueue.events.length).to.equal(0);

            });
        

            it("validation-fails", async ()=>{
                const results = await controller.saveUserData({"users":[
                    {"name":"bill"},
                    {"publicId":"colin"}
                ]});
                expect(results.errors.length).to.equal(2);
                expect(eventQueue.events.length).to.equal(0);

            });


            it("save-okay", async ()=>{
                const userOneRandomData = uniqid();
                const userTwoRandomData = uniqid();
                const results = await controller.saveUserData({
	"users": [{
		"id": "one",
		"publicId": "shy",
        "random":userOneRandomData,
		"about": {
			"content": "haro, I'm Mr One"
		}
	},
	{
		"id": "james",
        "random":userTwoRandomData,
		"about": {
			"content": "haro, I'm James \r\n# I am here"
		}
	}]
});
                expect(results.errors.length).to.equal(0);
                expect(eventQueue.events.length).to.equal(2);
                expect(eventQueue.events[0].data.id).to.equal("one");
                expect(eventQueue.events[1].data.id).to.equal("james");

            var savedUsers = await storageForData.readObjectFromJson(`/data/users.json`);
            expect(savedUsers.users.length).to.equal(2);
            
            assertUser(savedUsers.users[0], {id:"one", publicId:"shy",random: userOneRandomData,content: "haro, I'm Mr One",html:"<p>haro, I&#39;m Mr One</p>\n",name:"shy"});
            assertUser(savedUsers.users[1], {
                id: "james", publicId: "james",
                random: userTwoRandomData, content: "haro, I'm James \r\n# I am here", html: "<p>haro, I&#39;m James </p>\n<h1 id=\"i-am-here\">I am here</h1>\n", name: "james"
            });

            });
        });

    return module;
}

function assertUser(user, expected)
{
    expect(user.id).to.equal(expected.id);
    expect(user.publicId).to.equal(expected.publicId);
    expect(user.random).to.equal(expected.random);
    expect(user.about.content).to.equal(expected.content);
    expect(user.about.html).to.equal(expected.html);
    expect(user.name).to.equal(expected.name);
    
}