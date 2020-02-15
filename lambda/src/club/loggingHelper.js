/*
A handful of methods to let us debug stuff as JSON, 
letting us send all output to console.log if we are running on lambda, but using
the debug library locally to let us filter on specifics

Tried using the Pino library for outputting JSON, but this omits the awsRequestId
(I think Pino is writing output via a mechanism that lambda doesn't pick up)

*/
const LogFactory = require("log2/log-factory");

module.exports = function(name)
{
    const debug =loadDebug(name);

    var module = {};

    //write a simple type
    module.message = (msg, ...params)=>{
        if(debug)
        {
            debug(msg,...params);
        }
        else
        {
            module.json({msg,params});
        }
    }

    //log whatever is supplied as JSON
    module.json = (thing,msg)=>{
        if(msg && thing)
        {
            thing.msg = msg;
        }

        if(debug)
        {
            debug(JSON.stringify(thing));
        }
        else
        {
            thing.from = name;
            console.log(JSON.stringify(thing));
        }
    }
    
    /*
        Wraps up a block of code inside of a simple log that grabs
        the incoming http request, and logs the output
    */
    module.run =  async (request, code)=>
    {
        LogFactory.setLogRecordDecoratorToLambdaContext(request.lambdaContext);
        const logger = require("log2")("app");
        logger.batch("http").setDetailsData("path",request.context.path);
        logger.batch("http").setDetailsData("method",request.context.method);
        logger.batch("http").setDetailsData("queryString",request.queryString);
        logger.batch("http").setDetailsData("body",request.rawBody);
        
        
        // var requestLog = {
        //     requestId: request.lambdaContext.awsRequestId,
        //     method: request.context.method,
        //     path: request.context.path,
        //     queryString: request.queryString,
        //     body: request.rawBody

        // }
        try
        {
            
            var result = await code(request);
            //console.log(result);
            //requestLog.result = result;
            logger.batch("http").setDetailsData("result","ok");
            //module.json(requestLog);  
            
            LogFactory.writeUnsavedRecords();
            return result;
        }
        catch (error)
        {
            // requestLog.error = error;
            // module.json(requestLog, "run failed!");
            logger.batch("http").setDetailsData("result","failed");
            logger.batch("http").setDetailsData("error",error);
            LogFactory.writeUnsavedRecords();
            throw error;
        }
    }

    return module;

}


function loadDebug(name)
{
    if(process.env.DEBUG)
    {
        return require('debug')(name);
    }
    else
    {
        return null;
    }
}