class ExpressError extends Error
{
  constructor(status,message)
  {
    super();
    this.status=status;
    this.message=message;
  }
}

module.exports=ExpressError;

/* 
custom error
It extends the built-in JavaScript Error object.
Adds two extra properties:
status → the HTTP status code (e.g., 404, 500).
message → the error message you want to show.
So instead of throwing a plain Error, you can throw an ExpressError with both status and message.
*/