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

# 16 Feb 2019
Added a method to pull all comments from disqus and write to a json doc

# 21 Feb 2019
Added a method to build pages for each user listing stories they have not commented on

# 27 Mar 2019
Changed the way we do logging. Now we output JSON

# 4 April 2019
Loads of unit testing, refactoring, and added some caching around the data - our s3 reads and writes were MASSIVE

# 29 Apr 2020
Moved the HTML views out to the new storyclub repoistory
# 30 Apr 2020
Altered theme publish to *stop* using the cache. The initial takes around 20 seconds, which then causes the API gateway to timeout the request.
We introduced the cache because comment sync v1 was causing our S3 writes to be massive. But since comment sync now hits a DynamoDb I don't think we need the cache any more.
Yes, we'll end up hitting S3 a little more when publishing, but we don't publish very often...
