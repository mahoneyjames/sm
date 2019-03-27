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
