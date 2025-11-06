const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

//Index route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))//show route
  .patch( //update route
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //delete route

//update route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;

//serialize saves user id and deserilaize find by id and store in user

// router.get("/testlistings",async (req,res)=>
// {
//   let l1 = new Listing(

//     {
//       title:"my title"  ,
//       description:"my description",
//       price:"1000",
//       location:"my location",
//       country:"my country"
//     }
//   );

//   await l1.save().then((data)=>console.log(data));
//   console.log("l1 is saved");
//   res.send("successfull saving to db");
// }
// );
