# Structure (May 2019)


 - docs
	holds the original storymarmalade.co.uk site that hasn't really gone anywhere. Will probably dump this
	
 - sites
	put static websites here? 
	as we add more JS though I'll want to add in some way of testing
	Though isn't that fine? Create a build/deployment script that pulls together whatever is needed
	Ideally what I want is a npm run browse-sc which will launch a local web server, picking up static files, but also picking up the generated content from a *different* place, and immediately picking up changes to css or static content
	
 - libs
	Folder per shared project e.g. a comments api
	
	- comments
		Methods for interacting with comments stored in dynamnodb?
		This could be used for storymarmalade as well, so long as we share users with that site. 
		
		Dynamodb table per disqus site? 
	 - comments-sync
		Uses comments, and talks to disqus? 
		

 - lambda
	Dynamic portions of the the story club website
	Api
	Comment sync
	
 - lambdas
	Folder per lambda function?
	 - comment-sync
		Lambda that uses libs/comments and libs/comments-sync to sync the comment data store with disqus
		
	
 - test
	Put all test code here?
	Or test code that spans multiple things?
	Would be more natural to look for test code in the libs/comments folder
 

# Init a new function app
npm run http-install

# Deploy a function update
npm run http-update

# Manage different environments
Environment variables control the S3 bucket that's used. These are immutable for a given function version.

To keep things simple, there are *two* functions
 - storyclub2: production

 npm run http-update

 - storyclub-preview: preview

 npm run http-update-preview

# To host the site locally for testing
npm run browse

# Get start deving locally

 - serve the website locally
   - cmd.exe, then npm run browse
   - http://localhost:9999
 - host the web api locally
   - cmd.exe, then npm run local
   - postman

# Syncing comments
A dedicated lambda function for comment syncing, since the API gateway is 30 seconds
This is triggered by a CloudWatch rule every hour

# Website setup
A manual build process at the moment

_site/club
  bulma.css
  bulma-custom.css
  scripts/setup.js
    This needs to be edited to point to the correct web service end point i.e. localhost/preview/prod

Copy these up to the bucket using the S3 browser tool

