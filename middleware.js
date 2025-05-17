const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");
const { reviewSchema } = require("./schema");
const review = require("./models/review");
module.exports.isloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => { 
    const { id } = req.params;
    try {
        // Need to await this query to get the actual listing document
        const listing = await Listing.findById(id);
        
        // Check if listing exists
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listing");
        }
        
        // Check if current user is the owner
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You are not authorized to do that!");
            return res.redirect(`/listing/${id}`);
        }
        
        // If user is the owner, allow them to proceed
        next();
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listing");
    }
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};
const Review = require("./models/review");

// Add this middleware function to your existing middleware.js
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    try {
        // Find the review by ID
        const review = await Review.findById(reviewId);
        
        // Check if review exists
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/listing/${id}`);
        }
        
        // Check if the current user is the author of the review
        // Make sure review.author is populated or compare ObjectIds properly
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You don't have permission to do that!");
            return res.redirect(`/listing/${id}`);
        }
        
        // If user is the author, proceed
        next();
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong!");
        res.redirect(`/listing/${id}`);
    }
};