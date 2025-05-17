const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");

module.exports.createReview = (async (req, res) => {
    const { id } = req.params;
    console.log("Received ID for review:", id);

    const listing = await Listing.findById(id);
    if (!listing) {
        console.log("Error: Listing not found");
        throw new ExpressError("Listing not found", 404);
    }

    const newReview = new Review(req.body.reviews);
    newReview.author = req.user._id; // Assuming req.user is set by your authentication middleware
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new review posted successfully!");
    console.log("Redirecting to:", `/listing/${listing._id}`);
    res.redirect(`/listing/${listing._id}`); // ✅ Ensure redirecting to `_id`
})

module.exports.deleteReview = (async (req, res) => {
    const { id, reviewId } = req.params;
    try {
        // Use findByIdAndUpdate to remove the review from the listing
        const listing = await Listing.findByIdAndUpdate(id, 
            { $pull: { reviews: reviewId } },
            { new: true }
        );
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listing");
        }
        
        // Delete the review itself
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        
        if (!deletedReview) {
            req.flash("error", "Review not found");
            return res.redirect(`/listing/${id}`);
        }
        
        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error deleting review");
        res.redirect(`/listing/${id}`);
    }
})