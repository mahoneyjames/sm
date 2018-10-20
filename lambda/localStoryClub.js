require('dotenv').config({ path: 'variables.env' });

//console.log(process.env.AWS_SECRET);
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

const storyClub = require('./src/storyclub');
const data = require('./src/storyData.fs')
const lambda = require('./lambdaHttp');

var stories = [
{"order":100, "id":"1", "title":"All at badgers","author":"JamesM","link":"","permaLinks":["barry"],"format":"google","content":"So Pete was naked in my car again. Not just butt naked, he was ball naked, stretched out on the back seat with it all on show. No sign of his clothes, nor his wallet or shoes, but as Tim said, at least she left the keys.\n \nIt's not how Friday night was supposed to go. Four guys, few drinks, nice meal, and then home by midnight. The first two worked out for me, Tim and Jeremy, only Pete didn't get the message. What he got was forty drinks, not all for him, at least half went on the girl and her friends. They were half smashed before they even met Pete, so I guess that’s why she was fine with it being nine o’clock on the edge of the dance floor and Pete, total stranger, with his fingers where they really should not have been in polite company.\n \nI wasn’t going to give him the keys to the car, not again. Only when he came over he put both hands around Tim’s face and kissed him on the forehead.\n \nTim’s idea was that we leave him in the street. Maybe a naked night on the tiles will shock him into acting like a normal person. The problem with that – Pete’s mother. There’s only one thing she loves more than her Samurai sword collection, and that’s her sweet baby Pete. We couldn’t even drive him home and come back, at forty five minutes each way our swanky restaurant table was a gonna.\n  \nSo that was us, Friday night over, driving home to soggy fish and chips and warm lager from the offy. All of us talking big, how it’s the last time Pete comes out with us, how we’re going to tell him how rank we find his behaviour, but all of us knowing that come next month it’ll be the same thing over again.\n \nI didn’t think the night could dive any lower, and then Tim started shrieking in horror. I was looking in the mirror, I was looking at Pete’s still sleeping, yet strangely happy face, Tim was shouting about walking, and that's how I hit the badger.\n \nNot a killing blow, as it turns out, but at the time that poor badger sure looked a gonna, lying there all floppy on the side of the road. Lying there right under the sign for the boating lake. The boating lake we went to as kids, the one with the gate at the front where you pay to get in, and it looks like it has fences all round, only the wood’s all rotted where they let the hedges grow too close.\n \nFriday night was saved! Me, Tim, and Jeremy, three young guys yet we sat around that table like three old men, saying how nice it was to not have to shout to be heard. How it was Pete the one who'd need to bellow to be heard, out there in the middle of that lake, naked in a boat with a badger.\n \nAnd like I said, we all thought that badger was a gonna. \n"}
,{"order":99, "id":"2", "title":"Doggy style","author":"JennyA","link":"","permaLinks":["dogs-are-everywhere"],"format":"google","content":"Doggy Style\n\n“You can’t do that to him - he’ll be a laughing stock.”\n\n“Why? It’s so cute - isn’t it Andre?”\n\nIt was my final argument. I’d tried telling her it was cruel, a waste of time, that it was exploitative. Nothing. Even this appeal for Andre’s dignity failed to move her.\n\nAndre looked balefully out from his basket under the table. I shot him a glance of commiseration, but we both knew there was nothing I could do. He tried to retreat back under his blanket but Ellie had already picked him up by his pudgy middle and was trying to squeeze the tiny plastic raincoat over his head. He didn’t struggle.\n\n“Why would a dog need a raincoat? They love water! They love being wet!” \n\nUseless. My arguments, like Andre, were lost to Ellie’s latest fad. She was already Instagramming the two of them together, she pouting, he defeatedly gazing at the screen, his little legs dangling through the yellow plastic sleeves. Poor little sod. She added a flattering filter, some little cartoon raindrops and a few lurid hearts. Her phone was soon buzzing with Likes and she tapped happily away at it, revelling in the adulation.\n\nI had to be fair; as sorry as I felt for Andre and as awful, vacuous and shallow as I found my little sister’s passion for dressing him up and posing, I had to admit that she had a flair for fashion. The little coat was meticulously designed and sewn together with real skill. She’d been making paper dresses for Barbie since she was old enough to be allowed scissors, despite our mother’s best attempts to interest her in nature, The Great Outdoors, sports - anything that wasn’t pink and frilly. My sister turned out a rebel in glittery shoes.\n\nAnd now it was Andre’s turn. Barbie was old news, abandoned in a corner without a stitch on. Humiliated. ‘At least’ I thought ‘this probably won’t last long - she’s probably bored of it already and when she grows up she’ll start working on clothes for real people. When she’s a famous designer, we’ll look back and laugh. Andre will be alright...’\n\n“Aren’t you a bit old for dressing up toys and pets now?” I said in my most patronising tone. I wanted to embarrass her. Ellie looked at me with undisguised contempt. I squirmed, uncomfortably.\n\n“This shit sells for silly money. People love dressing their pets up - Instagram is full of it. Why do you think I never need cash? Knock a few of these out, share them online and the requests come flooding in. Some people” she told me wisely “have more money than sense.”\n\nShe emptied the contents of her school satchel onto the carpet. There was a tiny, four-legged sailor outfit, complete with hat; a little stetson and gun holster, with fringed chaps; four perfect replica Converse daps and even a pink tutu and tiara. I shuddered and felt old. Ellie picked up her camera determinedly. Andre whimpered.\n\n\n\n\n"}
,{"order":90, "id":"3", "title":"Death and mutilation","author":"LewisG","link":"","content":null}
,{"order":101, "id":"4", "title":"Dive right in","author":"JamesM","link":"https://docs.google.com/document/d/1Ba-x5yUSyHE8TD3kG7SW98G2-c-lcn7evFk8fDeMR_g/edit","format":"google","content":"‘I love it.’\n‘I hate it.’\n‘Well I love it.’\n‘And I hate it.’\n\nIt was two triangles without bases, and in between at the bottom was a small diamond ringed by small clouds. It was called “Mountains and lake”, done in freehand charcoal and nothing else. Of course they were going to buy it; she only had to turn those eyes on him and he was putty, but he liked the journey. He knew without asking it was going over the fireplace but he asked anyway, wanting to see her pout.\nIt was a talking point, this plain white canvas five foot by four with nothing on it but black lines, and nothing to frame it because the artist – Beverley – said that frames were cages and art should be free to soar.\nPeople said it was striking, or it was interesting.  But most often people would turn and look at him and say, ‘What is it?’\nIt was abstract. He’d say it firmly, and people not into art would nod sagely as if they knew, and people into art would nod sagely because they knew. Abstract is a genius artist, someone that persuades you stump up hard cash and do all the work in figuring it out.\nCouldn’t say that back to people.\nBut she loved it, and that was the main thing. He’d come home and find her stood in front of it. One time she had her arms folded on the shelf above the hearth, leaning so close she could have reached out with her tongue and licked it. He could barely stand the heat coming off the hearth but she seemed not to care, and she seemed not to notice until he put his arms on her shoulders and pulled her away.\nGlazed eyes looked back for a moment until she focussed. It was a breathy voice that spoke to him.\n‘I could see it. I could see the waters of the lake, and they were calling to me. Dive in, dive! And so I dove, deeper and deeper, and then I couldn’t breathe, and then…’\nAnd then she kissed him. And then she took him upstairs.\nAnd then it was different. There was something different about it, something he couldn’t quite put his finger on despite how hard he tried.\nWhen he showed the picture to his mother she stared hard for a long time as well. She turned her hard stare on both of them, and then sat on the sofa, knees pressed together, tartan handbag on top as a shield.\nIt was the most disgusting thing she’d ever seen.\n‘But…it’s abstract! It’s mountains and a lake, with little trees around.’\nAnd his mother said, ‘It’s a woman on her back. Those mountains are her legs, and she’s showing you her business.’\nAnd for the first time he looked, he really looked.\nAnd then he looked at his wife. Who was sat down with her knees pressed firmly together, one hand over her mouth. \n"}
,{"order":1, "id":"5", "title":"Trip trap","author":"JennyA","link":"","format":"google","content":"Trip trap\n\nNobody noticed them at first, of course. Who notices if a homeless guy is there one minute and then not the next? But one day the guy with the long dreadlocks and the dog wasn’t where he usually sat, and, the day after, the lady in the ragged trousers wasn’t dancing along to the high street buskers anymore and people started to wonder to each other on their walks to work where they had gone.\n\nIt was a lot more obvious to Joe. He saw them around, got to know one or two of them. Spent a few evenings sharing fags and chips round a bin on fire. It had taken a bit of getting used to, but for the most part the city’s homeless had been pretty accepting of Joe, as a newby.\n\nWhen Patrick, the guy with the dreads, wasn’t around anymore, that’s when Joe started to worry. Patrick was alright. He’d shown Joe some good places to sleep when it rained and had become a sort of fixture in his little routine. They’d sit together and share a coffee most mornings and Patrick would scratch the ears of his mud-brown shaggy dog and tell Joe stories. Joe would listen, scarcely believing a word, but enjoying the rare companionship.\n\nIt had been Patrick who’d told Joe about the bridge. Tucked away in a run-down part of town in an industrial estate, the bridge seemed to draw the city’s down and outs to it like moths. It was sheltered from the wind and rain, an ideal place to sleep, to use, to talk, if talking was what you wanted, to keep a fire going. In fact, the last time Joe had seen Patrick he’d invited him along to the bridge, but he told him no that time, couldn’t remember why now, but he’d had some reason he was sure.\n\nTonight it was raining hard. Patrick had been playing on Joe’s mind a lot and before he really realised what was happening, Joe had made his way to the bridge. For the first time Joe had been there it was completely abandoned. The grey, crumbling buildings dribbled sludgy runoff into the brown waters that gurgled noisily under the bridge. Far away a street light glowed a surreal orange, bathing the scene in a weird, ethereal light. Joe wiped the rain from his drenched forehead and looked around him. The whole place stank of rot and something long dead.\n\nToo tired to wonder much about the abandonment of the place Joe trudged on forward, not noticing the limp, mud-brown pile of shaggy fur oozing rainwater and something darker onto the uneven, cracked road, or the many single abandoned boots that lay ripped and scattered about the place, or the piles of gleaming white bones, picked clean and lying in neat piles here and there...\n\nAs he wandered under the bridge the gurgling noise became a low, dark, rumbling laugh and Joe disappeared into the shadow of the troll’s lair."}
,{"order":3, "id":"6", "title":"Jessica's Rabbit","author":"JennyA","link":"","format":"google","content":"Jessica's Rabbit\n\nThe girls stood in the kitchen, near the water-cooler in what looked like urgent discussion. Every day Steve watched them: their rapid hand gestures, the way their eyes lit up or glistened with tears in alternate distress, glee, shock or some mysterious, feminine combination of them all. \n\nClaire covered her mouth with her hands while Jessica’s lips moved almost silently, their eyes not breaking contact for a moment. Steve thought she looked upset.\n\nHe took his time rinsing out his cup, drying it meticulously with a paper towel, refilling it with the instant coffee, hot water, milk, his eyes and ears snatching at them as they spoke. To Steve, Jessica was beautiful and he’d been waiting for a chance to talk to her but he never knew where to start. He just felt like a bumbling fool.\n\nThis time though, he’d gotten lucky. Jessica might have thought she’d been silent, but Steve had caught the fractured ends of her sentences and they had given him an idea. If he could pull this off Jessica might actually, even if just for a second, become aware of his existence.\n\nAfter work Steve drove to Nico’s house. Nico had a beautiful cottage with a rickety old chimney teetering picturesquely into the night sky. Smoke gushed out in grey-blue spirals and light spilled generously from the windows. He didn’t stay long, but when he emerged he was holding a small cardboard box, which snuffled endearingly. \n\nHe’d driven Jessica home after a works dinner once, so he knew where she lived. He hoped it wasn’t creepy, just appearing on her doorstep like that, but his judgement told him it was right: Jessica was upset, his gift would make her feel better and he’d be Steve the Hero. For a while at least. \n\nHe got out of the car. It was bin night and he edged past Jessica’s recycling bag, blushing at the empty Tampax boxes and folded Ann Summers bag pressed against the transparent plastic.\n\nIt took a few minutes for her to answer the door and when she did she looked flushed and flustered and a little dreamy. She was wearing a dressing gown, which Steve thought was unusual for seven in the evening, but he said nothing, just looked at his feet.\n\n“Oh. Um Hi, Jessica. I hope you don’t mind. It’s just I overheard what you were talking about in the kitchen today and I have this friend who...well he breeds them, just outside of town and I thought, maybe, that this would help to cheer you up…”\n\nHe held the box out towards her, but she didn’t take it. Her expression ran from mortified, to confused to genuinely shocked. Mimicking Claire’s gesture from earlier, she raised her hands to cover her mouth. \n\n“Oh, God...Steve! That’s really, um, really sweet of you - but when I said that my, uh ‘rabbit died’ - well...I really didn’t mean that kind of rabbit…” The box in Steve’s arms snuffled in the horrified silence."},
{"id":"7", "title":"terry","author":"JamesM","link":"","permaLinks":[],"format":"markdown","content":"\nThis is my story about terry\n\n> It is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)\n\n# Yes, that’s correct"}];


var validStories = [];

const site = "storyclub";

async function processStories(themeId)
{

    var storyPromises = stories.map(async(story)=>
    {
        return await storyClub.publishThemeStory(themeId, story);
    });
   
    const storyResults = await Promise.all(storyPromises);   
}


async function publishTheme(theme)
{
    await storyClub.publishTheme(theme,{displayThemeInfo:true, displayAuthor:true});
}


//processStories("booyah");
//publishThemeAnonymously("testytesty");

const themeDetails = {"deadline":"2018-09-18T23:00:00.000Z","themeText":"Zombie","things":["Chimney","The Village People","boris"],"id":"booyah"};

//console.log(storyClub.generateThemePage(themeDetails));


//data.upload(data.bucketNameFromSite("storyclub"),"myfile.txt", "boo","text/plain");

//data.saveStoryClubStory("storyclub",{id:'barry',path:'bob',theme:'be'});

//console.log(publishTheme(themeDetails));
async function testStuff(dataLayer)
{


    await dataLayer.writeFile("file/something/here/1/i.json",JSON.stringify({path:'path1'}),"application/json");
    await dataLayer.writeFile("file/something/here/2/i.json",JSON.stringify({path:'path2'}),"application/json");
    await dataLayer.writeFile("file/something/here/am/page","<html/>","text/html"); 
    var thing = await dataLayer.readObjectFromJson("file/something/here/1/i.json");
    console.log(thing.path);

    var things = await dataLayer.listObjectsFromJson("file/something/here");
    console.log(things);


}


//testStuff(require('./src/club/data-local.js')({path:"_site/club/"}));

//testStuff(require('./src/club/data-s3.js')({bucket:"www.storyclub.co.uk"}));

// const theme = require('./src/club/theme');
// const themeData = {};
// console.log(theme.validate(themeData));
// console.log(themeData);

async function testData(storage)
{
    
    const data = require('./src/club/data')(storage);
    await data.saveStory("testytesty",stories[2]);
    await data.saveStory("testytesty",stories[6]);
    console.log(await data.listThemeStories("testytesty"));


}

testData(require('./src/club/storage/storage-local.js')({path:"_site/club/"}));