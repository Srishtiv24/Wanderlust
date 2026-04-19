module.exports= (func)=>
{
    return (req,res,next)=>
    {
      func(req,res,next).catch((err)=>next(err));
    };
}

/*
n older versions of Express, if an async function threw an error, it wouldn’t automatically be caught by Express.
Example:
js
app.get("/listings/:id", async (req, res) => {
  let listing = await Listing.findById(req.params.id); // if this rejects, Express crashes
  res.render("listings/show", { listing });
});
Without wrapAsync, you’d need a try/catch block to avoid unhandled promise rejections.

async error handling built-in → You don’t need wrapAsync anymore. 
If an async route throws or rejects, Express 5 automatically passes the error to your error-handling middleware.

app.get("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found!");
  res.render("listings/show", { listing });
});
No try/catch or wrapAsync needed — Express will catch the error and send it to your error middleware.
*/

//we generally use it so that no invalid values enter database , but we dont need this here as i have already price to be a number 
//moreover this version of express handles async errors by itself 

//If  due to a database issue, it throws a rejected promise. But Express 4.x doesn’t automatically catch promise rejections in route handlers.
// So the error bypasses Express’s internal error handling and crashes the app.
//Express 4.x expects errors to be passed explicitly via next(err). It doesn’t know what to do with a rejected promise unless you tell it:
//But writing try/catch in every route is messy. That’s why you use wrapAsync—a utility that catches promise rejections and forwards them to next() cleanly.