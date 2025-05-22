const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// Post Review
router.post("/",isLoggedin, wrapAsync(reviewController.createReview));

// Delete Review
router.delete("/:reviewId",isLoggedin,wrapAsync(reviewController.destroyReview));

module.exports = router;