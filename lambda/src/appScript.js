var folders =
{
  marmalade:"1FHKJWcL50F5LW2rAyBUGSiVu7BUDpFUn", 
  JennyA: "0BzsxQir9CvOEQVVsaElVTWNuSjQ", 
  JamesM:"1fK2gJ6amLwxEbkBCL_LSIoHLFnXgAcYH", 
  LewisG:"",
  MrTesty:"1Gs-2izzLDJWL5ogfpWdRk2cfswtFwdYj"
};

var endPoints = 
{
  prod:"https://6hh8ovnhp4.execute-api.eu-west-2.amazonaws.com/dev/",
  dev:"https://6hh8ovnhp4.execute-api.eu-west-2.amazonaws.com/dev/"
};

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Marmalade')
      .addItem('PREVIEW: publish story', 'publishStoryPreviewProd')
      .addItem('WWW: publish story', 'publishStoryWwwProd')
      .addItem('Compliment me', 'youSmell')
      .addItem('DEV DEV DEV PREVIEW: publish story', 'publishStoryPreviewDev')
      .addItem('DEV DEV DEV WWW: publish story', 'publishStoryWwwDev')
      
      
      .addToUi();
}

function youSmell()
{
  alert("You smell");
}

function publishStoryPreviewProd()
{
  publishStory("preview","prod");
}
function publishStoryPreviewDev()
{
  publishStory("preview","dev");
}
function publishStoryWwwProd()
{
  publishStory("www","prod");
}
function publishStoryWwwDev()
{
  publishStory("www","dev");
}


function publishStory(site, environment)
{
  var endPoint = endPoints[environment];
  if(endPoint==null)
  {
    throw "Could not deterimine function endpoint for environment " + environment;
  }
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("marmalade");
  var activeRange = sheet.getActiveRange();
  
  var indexTitle = findColumnIndex(sheet,"Title");
  var indexAuthor = findColumnIndex(sheet,"Author");
  var indexPermaLink = findColumnIndex(sheet,"Permanent story link");
  var indexStoryLink = findColumnIndex(sheet,"Story content link");
  var indexJson = findColumnIndex(sheet,"JSON");
  var indexLambdaResponseJson = findColumnIndex(sheet,"Lambda JSON response");
  
  var indexResult = -1;
  if(site=="preview")
  {
    indexResult = findColumnIndex(sheet,"Preview site status");
  }
  
  if(indexResult==-1)
  {
    throw "No column for displaying results has been configured";
  }
  
  for(var rowIndex=activeRange.getRowIndex(); rowIndex<activeRange.getRowIndex() + activeRange.getNumRows(); rowIndex++)
  {
    var rangeForRow = sheet.getRange(rowIndex, 1, 1, 100);
    var values = rangeForRow.getDisplayValues()[0];
    Logger.log(values);
    var json = {title: values[indexTitle], author: values[indexAuthor], link: values[indexStoryLink], permaLinks: []};
    var permaLink = values[indexPermaLink];
    if (permaLink!="")
    {
      json.permaLinks[json.permaLinks.length] = permaLink;
    }
    var content = loadContent(json);
    json.content = content;
    
    
    rangeForRow.getCell(1,getRangeColIndex(indexJson)).setValue(JSON.stringify(json));
      
    if(json.content==null || json.content=="")
    {

      rangeForRow.getCell(1, getRangeColIndex(indexResult)).setValue("Not found");      
    }
    else
    {
      //Logger.log(content);
      
    
      var response = saveStory(endPoint, site, json);
    
    
      rangeForRow.getCell(1, getRangeColIndex(indexLambdaResponseJson)).setValue(response);
      var jsonResponse =JSON.parse(response);
      if(jsonResponse.errors && jsonResponse.errors.length>0)
      {
        rangeForRow.getCell(1, getRangeColIndex(indexResult)).setValue(string.join(jsonResponse.errors));      
      }
      else 
      {
        rangeForRow.getCell(1, getRangeColIndex(indexResult)).setValue("Ok");      
      }
    }
  }
}

function getRangeColIndex(index)
{
  return parseInt(index)+1;
}

function alert(msg)
{
  SpreadsheetApp.getUi().alert(msg);
}

function saveStory(endPoint, site, story)
{
  var request = {story: story, site:site};
  return UrlFetchApp.fetch(endPoint, {method:"post", contentType: "application/json", payload: JSON.stringify(request)});
}

function loadContent(story)
{
  if(story.link)
  {
    if(story.link.indexOf("drive.google.com")>-1 || story.link.indexOf("docs.google.com")>-1)
    {
      var document = DocumentApp.openByUrl(story.link);
      story.format="google";
      return document.getBody().getText();
    }
  }
  
  //try to find the story in the user's folder
  var userFolder = DriveApp.getFolderById(folders[story.author]);
  if(userFolder==null)
  {
    throw 'Could not find a folder for author ' + story.author;
  }
  

  var file = getFile(userFolder, story.title);
  if(file==null)
  {
    file = getFile(userFolder, story.title + ".md");
    story.format="markdown";
  }
  
  if(file!=null)
  {  
    if(file.getMimeType()=="application/vnd.google-apps.document")
    {
      var document = DocumentApp.openById(file.getId());
      if(!story.format)
      {
        story.format="google";
      }
      return document.getBody().getText();    
    }
    else
    {
      return file.getBlob().getDataAsString();
    }
  }
  
  return null;  
}

function getFile(folder, name)
{
  var files = folder.getFilesByName(name);
  if(files.hasNext())
  {
    return files.next();
  }
  else
  {
    return null;
  }
    
}

function findColumnIndex(sheet, title)
{

  var values = sheet.getRange(1,1,1,100).getValues()[0];

  for(var colIndex in values)
  {
    if(values[colIndex]==title)
    {
      return colIndex;
    }
  }
  
  throw "Could not find a column for "  + title;
}