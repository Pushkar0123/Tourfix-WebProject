// Acquire Dotenv 
if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); /*Jo dotenv file hoti hai isko hum sirf development phase ma use krta hai
    production ma nhi ,,, So jab hum is code ko deploy kryga aur GITHUB ka upper bhi upload karenge tab kabhi galti sa
    bhi dotenv file ko nhi upload karenge(due to important credentials) and jab baad ma hum hosting/deploy karenge toh jo sarya 
    credential jo hum [.env} ma store kiya hai uska baad ma hum dusra tarika sa store karenge,-- deployment ka time pe hum 
    ek naya environment variable create karenge jo ki NODE_ENV aur NODE_ENV ka value deplyment ka baad hum set kar denge 
    "production" */
}
// console.log(process.env.SECRET);

// Grey out colour shows kar rha ki ya cheez aab file ma use nhi ho rha hai
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//-----------For ejs set up ------------
const path = require("path");
//POST to PUT
const methodOverride = require("method-override");
//Acquire npm EJS--> Help to create different type of template 
const ejsMate = require("ejs-mate");
// -----------wrapAsync acquire-----------
const wrapAsync = require("./utils/wrapAsync.js");
// -------------ExpressError acquire------------
const ExpressError = require("./utils/ExpressError.js");
// -------------Schema Validation Acquire----------
// const {listingSchema} = require("./schema.js"); iska jagah no--16
const {listingSchema, reviewSchema} = require("./schema.js");
//--Aquire Review model-------------------------------
const Review = require("./models/review.js");
//---- Acquire Router -------------------
const listingsRouter = require("./routes/listing.js");
// ----Acquire reviews-----------------------------
const reviewsRouter = require("./routes/review.js");
//------------Acquire model---user.js------------------
const userRouter = require("./routes/user.js");


//--------------------DataBase Connect------------------------

const dbUrl = process.env.ATLASDB_URL;

const Listing = require("./models/listing.js"); //for line 25
// -------Acquire Express Session----------------------------
const session = require("express-session");
// -------Acquire connect mongodb session---------------
const MongoStore = require("connect-mongo");
// ---------Acquire connect flash-----------------------
const flash = require("connect-flash");
// ---------Acquire passport-----------------------
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

main()
.then( () => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}
//--------------------------------------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//For Route
app.use(express.urlencoded({extended: true}));
// For POST to PUT 
app.use(methodOverride("_method"));
// For EJS
app.engine("ejs", ejsMate);
//For using Static file 
app.use(express.static(path.join(__dirname, "/public")));

// ----Using mongo session-----\
const store= MongoStore.create({ //from mongodb connection npm
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{ //adding function 
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store, // passing store option of MongoStore (above)
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // Adding session expireing date
    cookie: {
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true //Cross scripting attack ka liya use karta hai
    },
};

// app.get("/", (req,res) => { //Basic app form
//     res.send("Hi, i am root");
// });

// ---Using Session----
app.use(session(sessionOptions));
// ---Using Flash-----
app.use(flash());//note: issa hum app.use-listings and reviews sa pahle hi use karenge

//---passport initializing------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Accessing message in listing.js present in route at create route section (accessing in res ka local variable )
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    console.log(res.locals.success); 
    res.locals.error = req.flash("error"); // If any listing want to access after deletion we can flash this
    res.locals.currUser = req.user;// it save the curent user details
    next();
});

// -----Demo User-----
// app.get("/demoUser", async (req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student", //automatically added by passport-local-mongoose
//     });
//     let registedUser = await User.register(fakeUser, "helloworld");
//     res.send(registedUser);
// });

// // Middleware for Validation Listing
// const validateListing = (req, res, next) =>{
//     let {error} =listingSchema.validate(req.body); //copy line 126
//     // console.log(result); //copy line 130 
//     // if(result.error) { //copy line 131 convert to 54
//     if( error) {
//         // for extracting Object that can print in console we can do as
//         let errMsg = error.details.map((el) => el.message).join(",");
// /*we can create a variable(errMsg) issa errMsg ka ander hum apni sari ki sari details map kar sakte hai , map karna ka liya jo hamara ek ek individual
// element hai uska liya hum return karynga element ka message, mtlb har ek element ka error details sa unka message nikal kar aajyga aur in sabko 
// join kar denga with the help of "," (comma)-->sari error details comma sa separate hoka join ho jaynge. */
//         // throw new ExpressError(400, result.error); //copy line 132 convert into 56
//         // throw new ExpressError(400, error); //after writing line 56 it convert into 60
//         throw new ExpressError(400, errMsg); 
//     } //copy line 133
//     else{
//         next();
//     }
// };

// // Same validation as above for reviewSchema use in schema.js
// const validateReview = (req, res, next) =>{
//     let {error} = reviewSchema.validate(req.body);
//     if( error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg); 
//     }
//     else{
//     next();
//     }
// };

// // comment out from index route to delete route after introducing routes/listing.js
// // Index Route
// // app.get("/listings", wrapAsync(async (req, res) => {
// app.get("/", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({}); //Store the value comes from await in variable allListings
//     res.render("listings/index.ejs", {allListings});
// }));

// //Sample Url
// // app.get("/testListing", async (req,res) =>{
// //     let sampleListing = new Listing({
// //         title: "My New Villa",
// //         description: "By the beach",
// //         price:1200,
// //         location: "Calangute, Goa",
// //         country: "India",
// //     });
// //     //save karyga iss sample listing ko database ma
// //     await sampleListing.save();
// //     console.log("sample was saved");
// //     res.send("successful testing");
// // });

// //New Route (Isko show route se upar rkhna hai kuki pahle new render ho fir id ka liya check kiya jayga)

// // app.get("/listings/new", wrapAsync((req, res) => {
// app.get("/new", wrapAsync((req, res) => {
//     res.render("listings/new.ejs");
// }));

// //Show READ Route to print the indiviual id details
// // app.get("/listings/:id", wrapAsync(async (req, res) => { //async fun tab hi use karta jab data ma kuch change karna ho
// app.get("/:id", wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews"); // ID passes as argument
//     res.render("listings/show.ejs", {listing});
// }));

// //Create Route

// // app.post("/listings", wrapAsync(async (req, res, next) => {
// //     //custom error (use hoppscotch to see it)
// //     if(!req.body.listing) {
// //         throw new ExpressError(400, "Send valid data for listings");
// //     }
// //     // try{ // remove try and catch after introduce wrapAsync.js

// //     // let {title,description,image,price,country,location} = req.body; 
// //     /*dusra tariks ya ha ki new.ejs ma ja kar sarya variable(i.e title,description,price..)
// //     ko already Object(listing) ka key(title,price..) bana de*/

// //     // Syntax after change in new.ejs (listing[])

// //     // let listing = req.body.listing; 
// //     /*terminal ma jo js object bana with new value usko directly hum apne model ka document ka andher or model ka instance ka 
// //     andher convert kar sakte hein  */
// //     const newListing =new Listing(req.body.listing);

// //     //For handling particular field error in listings we have to do as:
// //     //Validation for Schema
// //     if(!newListing.title){
// //         throw new ExpressError(400, "Title is missing");
// //     }
// //     if(!newListing.description){
// //         throw new ExpressError(400, "Description is missing");
// //     }
// //     if(!newListing.location){
// //         throw new ExpressError(400, "Location is missing");
// //     }
// //     await newListing.save();
// //     res.redirect("/listings");
// //     console.log(newListing);
// //     // } catch (err) {
// //     //     next(err);
// //     // }
// // }));

// // app.post("/listings", 
// app.post("/", 
// validateListing, //After introducing Middleware for Validation Listing Above
// wrapAsync(async(req, res, next) =>{
//     //validation for schema after introduce schema.js(Shortcut of above)
//     // let result=listingSchema.validate(req.body);
//     // /*req.body ka ander send karna ka mtlb hai ki jo humne listingSchema create kiya hai joi ka ander, uske ander hum check kar rha hai ki 
//     // jo bhi schema ka ander condition ya constrain jo define kiya hai toh kya req.body unsara condition ko satisfy ya unke basis per 
//     // validate kar rahi hai aur jo bhi aayga ussa hum result ma store kar lenge*/
//     // console.log(result);
//     // // if(result.error) {
//     // //     throw new ExpressError(400, result.error);
//     // // }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));

// //Edit Route
// // app.get("/listings/:id/edit", wrapAsync(async(req,res) => {
// app.get("/:id/edit", wrapAsync(async(req,res) => {
//     let {id} = req.params; //extracting data for value in edit.ejs
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// }));

// //Update Route
// // app.put("/listings/:id", 
// app.put("/:id", 
// validateListing, //extracting data for value in edit.ejs
// wrapAsync(async (req, res) => {
//     // if(!req.body.listing) { //comment out (due to validateListings) after validation Middleware introduces
//     //     throw new ExpressError(400, "Send valid data for listings");
//     // }
//     let {id} = req.params; //Extracting id data
//     /*Ab listing to extract karna ka liye simply we write req.body.listing and call findByIdAndUpdate 
//     pahle parameter ka andher id pass karyga aur dushra ka under hum ek object pass karyga jiska andher deconstruct karna wala 
//     req.boby.listing ko basically it an object of JavaScript jeska ander sara ka sara parameter hein jisko deconstruct karka 
//     un parameter ko hum individual values ka ander convert karyga jisko hum apni naya updated value ka ander pass karyga */
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// // app.delete("/listings/:id",wrapAsync(async (req, res) => {
// app.delete("/:id",wrapAsync(async (req, res) => {
//     let {id} = req.params; //Extracting id data
//     let deleteListing = await Listing.findByIdAndDelete(id);
//     console.log(deleteListing);
//     res.redirect("/listings");
// }));

// After emitting routes/listing.js
app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews", reviewsRouter);/*review submit karna ka baad error aana ka karan ya hai ki jo :id wala parameter hai woh app.js ma hi rh 
jata hai toh review.js ka pass id aata hi nhi isko handle karna ka liye hum mergeParams use karta hai*/

app.use("/", userRouter);

// // comment out from index route to delete route after introducing routes/listing.js
// // Reviews--> Post Route
// app.post("/listings/:id/reviews", validateReview, wrapAsync (async(req, res) =>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review); // review is a object from show.ejs line no 56,62 (rating & comment include)

//     listing.reviews.push(newReview);// {aab har listing ka pass reviews arrray bhi hoga} reviews is a array from listing.js 

//     await newReview.save();
//     await listing.save(); /*jab bhi koi exiting document ka data ka ander koi change karna chahata hai toh uska liya (.save) ko call karna padta hai
//     jo khud ma ek asynchoronous function hota hai */

//     // console.log("new review saved");
//     // res.send("new review saved");
//     res.redirect(`/listings/${listing._id}`);
// }));

// // Delete Review Route POST
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync (async(req, res)=>{
//     let {id, reviewId} = req.params;
// // for updating the listing after extracting or delete the reviews we also delete($pull) its id from listings.
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }));

//--------------------------------------------------------------------------------------- 
// ExpressError
// [ * ] ka mtlb sara ka sara incoming request present route sa match kardaga agar kissa ka sath nhi match hua toh * ka pass ajayga
app.all("*", (req, res, next) =>{
    next(new ExpressError (404, "Page Not Found!"));
});

/* Middleware for defining Error handling over Server Side --> let take a example --> in a CREATE ROUTE(POST) as we can seen we directly
want to access listings object from req.body.listing and directly want to save it so agar ya listing uska ander prices ki value number nhi hogi
ya fir kuch aur tarika ka error honga toh us case ma humara pass jo error aayega wo Database sa aayega jo asynchronous error hoga
aur usa handel karna batut jaruri hai so now defing middleware*/
app.use((err, req, res, next)=>{
    // After introduce ExpressError.js
    let{statusCode=500, message="Somethings Went Wrong"} = err; //default value of statusCode(500) and message
    // res.send("Something went wrong");//1st
    // res.status(statusCode).send(message); //2nd

    // After making error.ejs 
    // res.render("error.ejs", {err}); //3rd--> it is use when we comment out line no 11 and 12 in error.ejs
    res.status(statusCode).render("error.ejs", {message}); //3rd  more prefrence
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});