require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");  
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;

app.get("/" ,(req,res)=>{
    res.send("Home Page");
});

const sessionOption = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + (7*24*60*60*1000), //Expires 1 week after login
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};
app.use(session(sessionOption));
app.use(flash()); //always write these before (1 and 2)

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

//Middleware to store data tp access anywhere
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get("/demouser", async(req,res)=>{
    let fakeUser = new User({
        email:"student2@gmail.com",
        username: "delta-stduent1",
    });
    let newUser = await User.register(fakeUser,"studentPassword");
    res.send(newUser);
})

// Express Router - to enhance readability
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main()
    .then(()=> console.log("Connected to DB"))
    .catch((err)=> console.log(err));

async function main(){
    await mongoose.connect(MongoURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

// // Index Route
// app.get("/listings" , async (req,res)=>{
//     const allListings = await Listing.find({}); 
//     res.render("listings/index.ejs" , {allListings});
// });

// // New Route
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// // Show Route
// app.get("/listings/:id", async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs", { listing });
// });

// // Create Route
// app.post("/listings", wrapAsync(async (req, res) => {
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
// }));

// //Edit Route
// app.get("/listings/:id/edit", async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// });

// //Update Route
// app.put("/listings/:id", async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// }); 

// //Delete Route
// app.delete("/listings/:id", async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listings");
// });

// All the about commented routes are shifted to listing.js in routes (Express router makes code more readable).
app.use("/listings",listingRouter); //1

// // Reviews--
// // Post Review
// app.post("/listings/:id/reviews", async (req,res)=>{
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);

//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();
//   res.redirect(`/listings/${listing._id}`);
// });
// // Delete Review
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
//   let {id, reviewId} = req.params;

//   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//   await Review.findByIdAndDelete(reviewId);

//   res.redirect(`/listings/${id}`);
// }));


// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404, "Page not found!"));
// });

// // Middleware error handling
// app.use((err,req,res,next)=>{
//   let {statusCode, message } = err;
//   res.status(statusCode).send(message);
// });
app.use("/listings/:id/reviews",reviewRouter); //2
app.use("/",userRouter);

app.listen(port , ()=>{
    console.log(`server is running on port ${port}`)
});