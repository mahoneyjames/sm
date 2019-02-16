# Sep 2018
Added Disqus support for commenting

# Jan 2019
Implemented claudia.js for deployment and API routing. 
No new features, but changes are massively easier to deploy (e.g. npm run http-update to deploy a function update in one go).

# 27 Jan 2019
Grouped themes by year into different pages
Added the latest theme to the home pages
Minor style tweaks to the story list theme page

# 30 Jan 2019
Added support for publishing author details
To add a new author
 - add them to the users sheet
 - update the JSON in _site/club/data/users.JSON
 - update this in S3

# 16 Jan 2019
Added a method to pull all comments from disqus and write to a json doc
