const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js"); //Acquire in middleware.js
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");
//Acquire validateReview middleware 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

// Acquire reviewController
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

// shift to middleware.js
// Same validation as above for reviewSchema use in schema.js
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

// Reviews--> Post Route

// router.post("/listings/:id/reviews", validateReview, wrapAsync (async(req, res) =>{
// router.post("/",isLoggedIn, validateReview, wrapAsync (
//----------transfer inforaation to listings.js----
    // async(req, res) =>{
    // console.log(req.params.id);
    // let listing = await Listing.findById(req.params.id);
    // let newReview = new Review(req.body.review); 
    // // adding detail of author how add review
    // newReview.author = req.user._id;
    // // console.log(newReview);
    
    // listing.reviews.push(newReview);

    // await newReview.save();
    // await listing.save(); 
    // req.flash("success", "New Review Created!");
    // res.redirect(`/listings/${listing._id}`);
    // }
// ----------------------------------------------------------
// ));

router.post("/",isLoggedIn, validateReview, 
wrapAsync (reviewController.createReview));

// Delete Review Route POST

// router.delete("/listings/:id/reviews/:reviewId", wrapAsync (async(req, res)=>{
// router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync (
//----------transfer inforaation to listings.js----
    // async(req, res)=>{
    // let {id, reviewId} = req.params;
    // await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    // await Review.findByIdAndDelete(reviewId);

    // req.flash("success", "Review Deleted!");
    // res.redirect(`/listings/${id}`);
    // }
// ------------------------------------------------------
// ));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
wrapAsync (reviewController.destroyReview));

module.exports = router;