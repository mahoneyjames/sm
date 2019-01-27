# Init a new function app
npm run http-install

# Deploy a function update
npm run http-update

# Manage different environments
Environment variables control the S3 bucket that's used.

Since these are immutable for a given function version, the dev/prod approach is
 - use latest for dev, point it at preview.storymarmalade.co.uk
 - when that is ready to become prod, change the environment variable to point to the correct bucket
 - publish a new function version to $LATEST$
 - point the prod alias at the previous version

# To host the site locally for testing
npm run browse

# Get start deving locally

 - serve the website locally
   - cmd.exe, then npm run browse
   - http://localhost:9999
 - host the web api locally
   - cmd.exe, then npm run local
   - postman

