const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });


module.exports.index=async (req, res) => {
    const allListing = await Listing.find();
    res.render("index.ejs", { allListing });
};

module.exports.renderNewForm=(req, res) => {

    res.render("new.ejs");
}

// controllers/listings.js
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author',
                    model: 'User'
                }
            })
            .populate('owner');
            
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listing");
        }
        
        res.render("show.ejs", { alisting: listing, currUser: req.user });
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listing");
    }
};
module.exports.createListing = async (req, res, next) => {
  try {
    // Forward geocode the location to get coordinates and geometry info
    const response = await geocodingClient.forwardGeocode({
      query: req.body.location,
      limit: 1,
    }).send();

    if (!response.body.features.length) {
      req.flash('error', 'Invalid location');
      return res.redirect('/listing/new');
    }

    // Extract geo info from Mapbox response
    const geoData = response.body.features[0].geometry;

    // Extract image data from file upload
    const url = req.file.path;
    const filename = req.file.filename;

    const { title, description, price, location, country } = req.body;

    // Create new listing with proper GeoJSON geometry object
    const newListing = new Listing({
      title,
      description,
      image: { url, filename },
      price,
      location,
      country,
      owner: req.user._id,
      geometry: {
        type: geoData.type,         // should be "Point"
        coordinates: geoData.coordinates  // [lng, lat]
      }
    });

    await newListing.save();

    console.log("Listing uploaded");
    req.flash("success", "Listing created successfully!");
    res.redirect("/listing");

  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;
    
    try {
        // Find the existing listing
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listing");
        }
        
        // Prepare the update object
        const updateData = {
            title,
            description,
            price,
            location,
            country
        };
        
        // Only update the image if a new one was uploaded
        if (req.file) {
            updateData.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        // Update the listing
        const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
        
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listing/${id}`);
        
    } catch (err) {
        console.log(err);
        req.flash("error", "Error updating listing");
        return res.redirect(`/listing/${id}`);
    }
};
module.exports.editListing=async (req, res) => {
    const { id } = req.params;
    try {
        const alisting = await Listing.findById(id);
        if (!alisting) {
            throw new ExpressError("Listing not found", 404);
        }
        res.render("edit.ejs", { alisting });
    } catch (err) {
        console.log(err);
        res.redirect("/listing");
    }
}
module.exports.deleteListing= async (req, res) => {
    const { id } = req.params;
    try {
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            throw new ExpressError("Listing not found", 404);
        }
        console.log(`Listing with ID ${id} deleted successfully.`);
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listing");
    } catch (err) {
        console.error(err);
        res.redirect("/listing");
    }
}