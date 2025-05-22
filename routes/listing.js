const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner} = require("../middleware.js"); 

const listingController = require("../controllers/listing.js");


 // Index Route
router.get("/" , wrapAsync(listingController.index));

// New Route
router.get("/new",isLoggedin , listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/",isLoggedin ,wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedin,isOwner ,wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id",isLoggedin ,isOwner, wrapAsync(listingController.updateListing)); 

//Delete Route
router.delete("/:id", isLoggedin,isOwner ,wrapAsync(listingController.destroyListing));

module.exports = router;