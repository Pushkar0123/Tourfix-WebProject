const Listing= require("./models/listing");
const Review= require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

// From route listing.js
module.exports.validateListing = (req, res, next) =>{
    let {error} =listingSchema.validate(req.body); 
    if( error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); 
    } 
    else{
        next();
    }
};

//From route reviews.js
module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if( error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); 
    }
    else{
    next();
    }
};

// For LoggedIn
module.exports.isLoggedIn = (req, res, next) =>{
    // console.log(req);
    // console.log(req.path, "..", req.originalUrl);
    // console.log(req.user);// through this we can check the user is logIn or log out
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you are not the owner of this listing!");
        return res.redirect("/login");
    }
    next();
}

/*hum middleware.js ka ander req.session.redirectUrl ki value ko LOCALS ma save kar lete hai aur locals aasa variable hai jo
haar jagah accessible hota hai and humara passport ka pass access nhi hai local ko delete karna ka so we create new middleware
in middleware.js*/
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//Middleware for authorization listing.js
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    // Making listing.js  authorization (safe)
    let listing= await Listing.findById(id); //acquiring above listing Data
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You din't have permission to edit");
        return res.redirect(`/listings/${id}`);
    } // agar hum return nhi karta toh woh next opertaion perform karta rhta 
    next();
};

//Middleware for those who delete the review is the owner of that review also.
module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params; //extract id which comes from request
    let review= await Review.findById(reviewId); //acquiring above listing Data
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    } // agar hum return nhi karta toh woh next opertaion perform karta rhta 
    next();
};