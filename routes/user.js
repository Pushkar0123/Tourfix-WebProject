const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// Acquire UserController
const UserController = require("../controllers/users.js");

//--------Using the router.route to make the similar path in a same route
router
.route("/signup")
.get(UserController.renderSignupForm)
.post(wrapAsync(UserController.signup));

router
.route("/login")
.get(UserController.renderLoginForm)
.post( 
    saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect: "/login",failureFlash: true,}),
    UserController.login);

// router.get("/signup", 
//----------transfer inforaation to listings.js----
    // (req, res)=>{
    // res.render("users/signup.ejs");
    // }
// --------------------------------------------
// );

// -------------//using router.route----------------
// router.get("/signup", UserController.renderSignupForm);

// router.post("/signup", wrapAsync(async(req, res)=>{
//     let {username, email, password} = req.body; /// body sa details extract hoga 
//     const newUser = new User({email, username});
//     const registeredUser = await User.register(newUser, password);
//     console.log(registeredUser);
//     req.flash("success", "Welcome to Wanderlust!");
//     res.redirect("/listings");
// }));

//OR 
// router.post("/signup", wrapAsync(
//----------transfer inforaation to listings.js----
    // async(req, res)=>{
    // try{
    //     let {username, email, password} = req.body; /// body sa details extract hoga 
    // const newUser = new User({email, username});
    // const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    // // Automatically login after sign up
    // req.login(registeredUser, (er)=>{
    //     if(er) {
    //         return next(err);
    //     }
    //     req.flash("success", "Welcome to Wanderlust!");
    //     res.redirect("/listings");
    // })

    // } catch(e) {
    //     req.flash("error", e.message);
    //     res.redirect("/signup");
    // }
    // }
// ------------------------------------------------
// ));

// -------------//using router.route----------------
// router.post("/signup", wrapAsync(UserController.signup));



// router.get("/login", 
//----------transfer inforaation to listings.js----
    // (req , res)=>{
    // res.render("users/login.ejs");
    // }
// -----------------------------------------------
// )

// -------------//using router.route----------------
// router.get("/login", UserController.renderLoginForm);


// router.post("/login", 
//     saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect: "/login",failureFlash: true,}),
//----------transfer inforaation to listings.js----
    // async (req, res) =>{
    //     // res.send("Welcome to wanderlust! You are logged in!");
    //     req.flash("success", "Welcome back to wanderlust! ");
    //     // res.redirect("/listings");
    //     // res.redirect(req.session.redirectUrl);

    //     /*general case ka ander ya workout ho jayega but yaha per passport hume problem dega, passport ka ander automatically jaisa hi 
    //     '/login' karnge i.e passport na authenticate kar diya aur hum login karga , wase hee passport bydefault req.session ko reset 
    //     kr deta hai, yani agar hamra middleware na koi extra information uska ander store karyi hogi ya jo redirectUrl hai agar usko
    //     humne store karya hoga, toh user.js ka ander jo '/login' hai waha per passport session ka ander sa redirectUrl ko delete kar dega
    //     so basically hum jab bhi redirectUrl ko access krna ki kosis kr rha toh ya ek empty undefined value hogi , toh isiliya hum 
    //     middleware.js ka ander req.session.redirectUrl ki value ko LOCALS ma save kar lete hai aur locals aasa variable hai jo
    //     haar jagah accessible hota hai and humara passport ka pass access nhi hai local ko delete karna ka so we create new middleware
    //     in middleware.js*/
    //     let redirectUrl = res.locals.redirectUrl || "/listings";
    //     res.redirect(redirectUrl);
    // }
// ----------------------------------------------------
// );

// -------------//using router.route----------------
// router.post("/login", 
//     saveRedirectUrl,
//     passport.authenticate("local",
//     {failureRedirect: "/login",failureFlash: true,}),
//     UserController.login);


//LogOut Route
// router.get("/logout", 
//----------transfer inforaation to listings.js----
    // (req, res,next)=>{
    // req.logout((err)=>{ /*ya apna aap ma call back leta hai as a parameter that means jaisa hee user
    // logout ho jaye uska baad immediately kya kaam hona chahiya woh hum call back ka ander likhta hai*/
    // if(err) {
    // return next(err);
    // }
    // req.flash("success", "you are logged out!")
    // res.redirect("/listings");
    // })
    // }
// -------------------------------------------------
// )

router.get("/logout", UserController.logout);

module.exports =router;