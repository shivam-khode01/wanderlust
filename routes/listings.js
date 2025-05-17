const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require('../schema.js');
const {isloggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const listing = require("../models/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); // Set the destination for uploaded files


router.route("/")
// All Listings Route
.get(wrapAsync(listingController.index))
// Create Listing Handler
.post(isloggedIn,upload.single("image"),validateListing, listingController.createListing);



// Create Listing Form Route
router.get("/new",isloggedIn,listingController.renderNewForm );


router.route("/:id")
// Show Listing Route
.get(listingController.showListing)
// Update Listing Route
.put(isloggedIn,isOwner,upload.single("image"), validateListing,listingController.renderEditForm)
// Delete Listing Route
.delete(isOwner,isloggedIn,listingController.deleteListing);






// Edit Listing Form Route
router.get("/:id/edit",isOwner,isloggedIn, listingController.editListing);


module.exports = router;