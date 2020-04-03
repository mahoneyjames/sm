// /*
// A handful of methods to let us debug stuff as JSON, 
// letting us send all output to console.log if we are running on lambda, but using
// the debug library locally to let us filter on specifics

// Tried using the Pino library for outputting JSON, but this omits the awsRequestId
// (I think Pino is writing output via a mechanism that lambda doesn't pick up)

// */
// const LogFactory = require("log2/log-factory");
// const LogHelpers = require("log2/log-helpers")();

// module.exports = function(name)
// {
//     var module = {};

   
//     /*
//         Wraps up a block of code inside of a simple log that grabs
//         the incoming http request, and logs the output
//     */
//     module.run =  async (request, code)=>
//     {
//         LogHelpers.decorateLogWithLambdaContext(request.lambdaContext, {path:request.context.path});        
//         const logger = require("log2")(name);

//         logger.batch("http")
//                 .merge({path:request.context.path, 
//                         method:request.context.method, 
//                         queryString: request.queryString, 
//                         body:request.rawBody});
        
        
//         // var requestLog = {
//         //     requestId: request.lambdaContext.awsRequestId,
//         //     method: request.context.method,
//         //     path: request.context.path,
//         //     queryString: request.queryString,
//         //     body: request.rawBody

//         // }
//         try
//         {
            
//             var result = await code(request);
//             //console.log(result);
//             //requestLog.result = result;
//             logger.batch("http").setData("result","ok");
//             //module.json(requestLog);  
            
//             LogFactory.writeUnsavedRecords();
//             return result;
//         }
//         catch (error)
//         {
//             // requestLog.error = error;
//             // module.json(requestLog, "run failed!");
//             logger.batch("http").merge({result: "failed", errorMessage:error.message, errorStack: error.stack});
//             LogFactory.writeUnsavedRecords();
            
//             return {result: "failed", error: error.message};
//         }
//     }

//     return module;

// }


