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

