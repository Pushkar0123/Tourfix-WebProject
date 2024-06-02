const Listing = require("../models/listing");
// Acquiring mapbox-sdk servies
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => { 
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate( { 
        path:"reviews", // listing ma sara review aajya---
        populate: {
            path:"author", // ---aur har ek review ka sath uska author ka naam bhi aajya
        },   
    }) // show the information of reviews with its author
    .populate("owner"); // show the information of owner

    if(!listing) {// If any listing want to access after deletion we can flash this
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next) =>{
    // copy basic code from github full docu- geocoding-example
    let response = await geocodingClient.forwardGeocode({
        // query: "New Delhi, India",
        query: req.body.listing.location,
        limit: 1
    })
        .send()
    // console.log(response.body.features[0].geometry);
    // res.send("done!")

    //after image upload function-- try to save in database
    let url= req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id; // page per owner ka username print akr dega extrat kar ka
    newListing.image = {url, filename};
    // after using geoJSON in models-listing.js
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    //---using flash when new listing iis created-----
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    
    if(!listing) {// If any listing want to access after deletion we can flash this
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    // Use this for changing the parameter aur other things og image url that show at upload time.
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params; 
    // Making midddleware is better instead of copy or paste this whole code in each route

    // // Making listing.js  authorization (safe)
    // let listing= await Listing.findById(id);
    // if(!listing.owner.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You din't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // } // agar hum return nhi karta toh woh next opertaion perform karta rhta 

    // await Listing.findByIdAndUpdate(id, {...req.body.listing});

    // ----for image update and save in the variable called listing----
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){ 
    //Js ka ander value check krni ho ki woh undefined hai ya nhi then we use [typeof] with undefined string
    let url= req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params; //Extracting id data
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};