module.exports= (func)=>
{
    return (req,res,next)=>
    {
      func(req,res,next).catch((err)=>next(err));
    };
}

//we generally use it so that no valid values enter database , but we dont need this here as i have already price to be a number 
//moreover this version of express handles async errors by itself 

//If  due to a database issue, it throws a rejected promise. But Express 4.x doesn’t automatically catch promise rejections in route handlers.
// So the error bypasses Express’s internal error handling and crashes the app.
//Express 4.x expects errors to be passed explicitly via next(err). It doesn’t know what to do with a rejected promise unless you tell it:
//But writing try/catch in every route is messy. That’s why you use wrapAsync—a utility that catches promise rejections and forwards them to next() cleanly.