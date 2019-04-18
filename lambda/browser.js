/*
Crude method of previewing the sort of dynamic story files written to disk 
instead of up to S3.
*/

const express = require('express');
const path = require('path');
const app = express();

console.log(__dirname);
app.use(express.static(path.join(__dirname, './_site')));

app.get("*",(req, res, next)=>{
    console.log(req.url);
    let url = null;
    if(req.url=="/")
    {
        url = "/index.htm";
    }
    else if (req.url.slice(-3)=="css")
    {
        url = req.url;
    }
    else if(req.url.slice(-1)=="/")
    {
        url = req.url.slice(0,req.url.length-1) + ".htm";
    }
    else if(req.url.slice(-2)=="js")
    {
        url = req.url;
    }
    else
    {
        url = req.url + ".htm";
    }
     
    
    res.sendFile(__dirname + `/_site/club${url}`);
});
app.set('port', process.env.PORT || 9999);

console.log("here");

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
  console.log(server.address());
});
