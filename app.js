if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const router = express.Router();  
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require('./schema.js');
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");
const userRouter = require("./routes/user.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Set the destination for uploaded files
// Connect to the database
const dbUrl = process.env.ATLASDB_URL;
main()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files

// Middleware


app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    console.log("Request body:", req.body);
    next();
});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600, // time period in seconds
});
store.on("error", ()=>{
    console.log("Session store error",err);
});

const sessionOptions = {
    store: store,
    secret :process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    }
};


app.use(session(sessionOptions)); 
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Index Route
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // Make currentUser available in all views
    next();
});

app.use("/", userRouter);
app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews);

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err; // Default to 500
    res.status(statusCode).render("error.ejs", { message }); // Render error page
});

// Start the Server
app.listen(8080, () => {
    console.log("Server is running on : 8080");
});