require('dotenv').config({ path: 'variables.env' });

//console.log(process.env.AWS_SECRET);
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});


async function testLambda()
{
    const lambda = require('./lambdaHttp');
    console.log(await lambda.genericFunction({action:"sc-static"}));    
}

testLambda();