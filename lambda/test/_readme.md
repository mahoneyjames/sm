Setting up test data is a bit hoop jumpy! Need to figure out a better way.

Mocha looks through all imports for describe() and it() calls, but 
any awaits cause it to miss picking things up because the await blocks

Sometimes the tests will complete, sometimes they won't. Depends whether Mocha thinks
it has run all the other tests or not before our setup code completes.

So our technique is to pass a function into the actual test classes to defer 
setting up local storage until Mocha actually starts to process tests in that file


# Run a smoke test of the API locally
npm run host-test-api-blank

in another shell, run

mocha -f local-api