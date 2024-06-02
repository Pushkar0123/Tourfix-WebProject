const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
// Require ListingController
const listingController = require("../controllers/listings.js");
const { deserializeUser } = require("passport");
// Require multer for image upload manipulation
const multer = require('multer')// means forms ka data ko pass krne ka liye multer use krenge and-----
// Require mluter storage process 
const {storage} = require("../cloudConfig.js")
// Require multer for image upload manipulation
// const upload = multer({ dest: 'uploads/'})//--and multer kya karega form ka data sa file ko nikalyga aur unhe uploads(automatically gen) naam ka folder ma save kr dega
const upload = multer({ storage })

//----Combining the same path using the router.route functionality-----    
router
.route("/")
.get(wrapAsync(listingController.index))
.post( //jab bhi form submit hoga hai yaha sa post request jata hai
    isLoggedIn,
    upload.single('listing[image]'),//middleware (image upload functionality uses)
    validateListing,
    wrapAsync(listingController.createListing)
);

// .post( upload.single('listing[image]'), (req,res)=>{
//     // res.send(req.body);
//     res.send(req.file);
// })

//New route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync (listingController.showListing))
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),//middleware(image edit functionality uses)
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
        .delete(isLoggedIn, isOwner, 
        wrapAsync(listingController.destroyListing)
);

//Shift to middleware.js
// const validateListing = (req, res, next) =>{
//     let {error} =listingSchema.validate(req.body); 
//     if( error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg); 
//     } 
//     else{
//         next();
//     }
// };

// Index Route
//transfer inforaation to listings.js
// router.get("/", wrapAsync(async (req, res) => { 
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", {allListings});
// }
// ));

// -------------//using router.route----------------
// router.get("/", wrapAsync(listingController.index));


//New Route (Isko show route se upar rkhna hai kuki pahle new render ho fir id ka liya check kiya jayga)
// router.get("/new",isLoggedIn, wrapAsync(
    //transfer inforaation to listings.js
    // (req, res) => {

    // // Added to ensure that user is authenticate to create new listing
    // console.log(req.user);//show esenatial part of the information of the user i.e username,email,id
    // /*jaisa hi user login ho jya toh humari jo request object ka ander user relates informations store 
    // hoti hai and yahi information trigger this authentication ya identify krn ka liya ki hamara user login hai ki nhi */
    // if(!req.isAuthenticated()){
    //     req.flash("error", "you must be logged in to create listing!");
    //     return res.redirect("/login");
    // }

    //transfer inforaation to listings.js
    // res.render("listings/new.ejs");
    // }
// ));

// router.get("/new",isLoggedIn, listingController.renderNewForm); // this wrote above because of preference

//Show Route to print the indiviual id details
// router.get("/:id", wrapAsync (
//----------transfer inforaation to listings.js----
//     async (req, res) => { 
//     let {id} = req.params;
//     const listing = await Listing.findById(id)
//     .populate( { 
//         path:"reviews", // listing ma sara review aajya---
//         populate: {
//             path:"author", // ---aur har ek review ka sath uska author ka naam bhi aajya
//         },   
//     }) // show the information of reviews with its author
//     .populate("owner"); // show the information of owner

//     if(!listing) {// If any listing want to access after deletion we can flash this
//         req.flash("error", "Listing you requested for does not exists!");
//         res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", {listing});
// }
// ---------------------------------------
// ));

// -------------//using router.route----------------
// router.get("/:id", wrapAsync (listingController.showListing)); 

// Create route
// router.post("/", 
// isLoggedIn,
// validateListing, 
// wrapAsync(
//----------transfer inforaation to listings.js----
    // async(req, res, next) =>{
    // const newListing = new Listing(req.body.listing);
    // // console.log(req.user);
    // newListing.owner = req.user._id; // page per owner ka username print akr dega extrat kar ka
    // await newListing.save();
    // //---using flash when new listing iis created-----
    // req.flash("success", "New Listing Created!");
    // res.redirect("/listings");
    // }
// ---------------------------------------------------
// ));

// -------------//using router.route----------------
// router.post("/", isLoggedIn,validateListing, 
// wrapAsync(listingController.createListing)); 

//Edit Route
// router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(
//----------transfer inforaation to listings.js----
    // async(req,res) => {
    // let {id} = req.params; 
    // const listing = await Listing.findById(id);
    
    // if(!listing) {// If any listing want to access after deletion we can flash this
    //     req.flash("error", "Listing you requested for does not exists!");
    //     res.redirect("/listings");
    // }
    // res.render("listings/edit.ejs", {listing});
    // }
// ------------------------------------------------------
// ));

router.get("/:id/edit",isLoggedIn, isOwner, 
wrapAsync(listingController.renderEditForm));

//Update Route
// router.put("/:id", 
// isLoggedIn,
// isOwner,
// validateListing, 
// wrapAsync(
//----------transfer inforaation to listings.js----
    // async (req, res) => {
    // let {id} = req.params; 
    // // Making midddleware is better instead of copy or paste this whole code in each route

    // // // Making listing.js  authorization (safe)
    // // let listing= await Listing.findById(id);
    // // if(!listing.owner.equals(res.locals.currUser._id)) {
    // //     req.flash("error", "You din't have permission to edit");
    // //     return res.redirect(`/listings/${id}`);
    // // } // agar hum return nhi karta toh woh next opertaion perform karta rhta 

    // await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // req.flash("success", "Listing Updated!");
    // res.redirect(`/listings/${id}`);
    // }
// --------------------------------------------------
// ));

// -------------//using router.route----------------
// router.put("/:id", isLoggedIn,isOwner,validateListing, 
// wrapAsync(listingController.updateListing));  //using router.router

//Delete Route
// router.delete("/:id",isLoggedIn, isOwner, wrapAsync()
//----------transfer inforaation to listings.js----
    // async (req, res) => {
    // let {id} = req.params; //Extracting id data
    // let deleteListing = await Listing.findByIdAndDelete(id);
    // console.log(deleteListing);
    // req.flash("success", "Listing Deleted!");
    // res.redirect("/listings");
    // }
// ----------------------------------------------------
// ));

// -------------//using router.route----------------
// router.delete("/:id",isLoggedIn, isOwner, 
// wrapAsync(listingController.destroyListing));

module.exports = router; //router object