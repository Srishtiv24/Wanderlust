const Listing = require("../models/listing.js");
const opencage = require('opencage-api-client');

module.exports.index=
    async (req, res) => {
        const allListings = await Listing.find();
        res.render("listings/index.ejs", { allListings });
    }

module.exports.renderNewForm=(req, res) => {
      res.render("listings/new.ejs");
}

module.exports.createListing=async (req,res,next) => {
  if (!req.file) {
   req.flash("error",'Image upload is required.');
   return res.redirect("listings/new");
  }
  let url=req.file.path;
  let filename=req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;//from passport after login 
  newListing.image={url,filename};
  await newListing.save();
  console.log(newListing);
  req.flash("success","New Listing Created !");
  res.redirect("/listings");
}

module.exports.showListing=async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id)
  .populate(
    { path:'reviews',
      populate:{
        path:"author"
      }
    })
  .populate('owner');
  if (!listing) {
    req.flash("error","Listing you requested for doesn't exist !");
    return res.redirect("/listings");
  }
  let {lat,lng}=await getCoordinates(listing.location,listing.country);
  res.render("listings/show.ejs", { listing,lat,lng });
}

async function getCoordinates(location, country) {
  try {
        const data=await opencage.geocode({ q: `${location}, ${country}` ,key: process.env.OPENCAGE_API_KEY });
    if (data.status.code === 200 && data.results.length > 0) {
      console.log(data.results[0].geometry);
      return data.results[0].geometry;
    } else {
      return { lat: 28.644800, lng: 77.216721 }; // fallback to Delhi
    }
  } catch (error) {
    console.warn('Geocoding error:', error.message);
    return { lat: 28.644800, lng: 77.216721 };
  }
}

module.exports.renderEditForm=async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist !");
    return res.redirect("/listings");
  }

  let originalImageUrl=listing.image.url;
  listing.image.url=originalImageUrl.replace("/upload","/upload/w_250");//less pixel
  res.render("listings/edit.ejs", { listing });
}

module.exports.editListing=async (req, res, next) => {
  const { id } = req.params;//req.params refers to the route parameters — values captured from the URL path when you define routes with placeholders.
  let updatedListing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(req.file)//if new file uplaoded
  { 
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
    await updatedListing.save();
  }
  req.flash("success", "Listing Updated !");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
  const { id } = req.params;//req.params comes from the route definition -:id
  let deletedListing = await Listing.findByIdAndDelete(id);//here cascade del mongo hook will run deifned in models part which deltes reviews //Since findByIdAndDelete internally calls findOneAndDelete, the "findOneAndDelete" middleware will run for both.
  console.log(deletedListing);
  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
}

/*
casecade del - 
Mongoose middleware types
Pre middleware (.pre)  
Runs before a certain operation executes.
Example:

js
listingSchema.pre("save", function(next) {
  console.log("About to save listing");
  next();
});
→ Useful if you want to validate, modify, or block something before it happens.

Post middleware (.post)  
Runs after the operation has finished.
Example:

js
listingSchema.post("save", function(doc) {
  console.log("Listing saved:", doc);
});
→ Useful if you want to clean up, log, or trigger side effects after the document is already persisted/deleted.

req.file → comes from your file upload middleware (usually multer or multer-storage-cloudinary).
If the user uploads a new image, req.file will contain metadata like path and filename.
If no file is uploaded, req.file is undefined, so the block is skipped.
*/