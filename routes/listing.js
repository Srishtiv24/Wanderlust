const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing");

// POST /listings/:id/gallery
router.post(
  "/:id/gallery",
  isLoggedIn,
  upload.array("gallery", 10),
  async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
      }
      if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission.");
        return res.redirect(`/listings/${req.params.id}`);
      }
      if (!req.files || req.files.length === 0) {
        req.flash("error", "No files selected.");
        return res.redirect(`/listings/${req.params.id}`);
      }
      const newMedia = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
        type: f.mimetype.startsWith("video") ? "video" : "image",
      }));
      listing.gallery.push(...newMedia);
      await listing.save();
      req.flash(
        "success",
        `${newMedia.length} file${newMedia.length !== 1 ? "s" : ""} uploaded!`
      );
      res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
      console.error("[Gallery upload error]", err);
      req.flash("error", "Upload failed. Please try again.");
      res.redirect(`/listings/${req.params.id}`);
    }
  }
);

// DELETE /listings/:id/gallery/delete
router.delete("/:id/gallery/delete", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "Permission denied.");
      return res.redirect(`/listings/${req.params.id}`);
    }

    const { filename, resourceType } = req.body;
    if (!filename) {
      req.flash("error", "No file specified.");
      return res.redirect(`/listings/${req.params.id}`);
    }

    await cloudinary.uploader.destroy(filename, {
      resource_type: resourceType === "video" ? "video" : "image",
    });

    listing.gallery = listing.gallery.filter((m) => m.filename !== filename);
    await listing.save();

    req.flash("success", "Photo deleted.");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    console.error("[Gallery delete error]", err);
    req.flash("error", "Delete failed. Please try again.");
    res.redirect(`/listings/${req.params.id}`);
  }
});

// Index + Create
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show + Update + Delete
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
