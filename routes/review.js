// ─────────────────────────────────────────────────────────────
// FIX: "Cannot read properties of undefined (reading 'review')"
//
// Root cause: the review form uses enctype="multipart/form-data"
// which bypasses express.urlencoded(). Without multer on the route,
// req.body is completely empty → req.body.review is undefined.
//
// Solution: add upload.array('reviewMedia', 5) BEFORE the controller.
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router({ mergeParams: true });
const multer  = require('multer');

const { storage }        = require('../cloudConfig');      // your fixed cloudinary.js
const { isLoggedIn }     = require('../middleware');       // your auth guard
const reviewController   = require('../controllers/review');

// One multer instance — shared for both listing and review uploads
const upload = multer({ storage });

// ── POST   /listings/:id/reviews ──────────────────────────────
// upload.array('reviewMedia', 5)  parses the multipart body AND
// the text fields (review[rating], review[comment]) in one step.
router.post(
  '/',
  isLoggedIn,
  upload.array('reviewMedia', 5),   // ← THIS was missing; caused the crash
  reviewController.createReview,
);

// ── DELETE /listings/:id/reviews/:reviewId ────────────────────
router.delete(
  '/:reviewId',
  isLoggedIn,
  reviewController.destroyReview,
);

module.exports = router;


// ─────────────────────────────────────────────────────────────
// If your reviews router is inline in listings.js, the fix is:
//
//   const upload = multer({ storage });
//
//   router.post(
//     '/:id/reviews',
//     isLoggedIn,
//     upload.array('reviewMedia', 5),   // ← add this line
//     wrapAsync(reviewController.createReview)
//   );
// ─────────────────────────────────────────────────────────────