const User = require("../models/user");

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
    };

module.exports.signup = async(req, res)=>{
    try{
        let {username, email, password} = req.body; /// body sa details extract hoga 
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    // Automatically login after sign up
    req.login(registeredUser, (er)=>{
        if(er) {
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    })

    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    };


module.exports.renderLoginForm = (req , res)=>{
    res.render("users/login.ejs");
    };


module.exports.login = async (req, res) =>{
    // res.send("Welcome to wanderlust! You are logged in!");
    req.flash("success", "Welcome back to wanderlust! ");
    // res.redirect("/listings");
    // res.redirect(req.session.redirectUrl);

    /*general case ka ander ya workout ho jayega but yaha per passport hume problem dega, passport ka ander automatically jaisa hi 
    '/login' karnge i.e passport na authenticate kar diya aur hum login karga , wase hee passport bydefault req.session ko reset 
    kr deta hai, yani agar hamra middleware na koi extra information uska ander store karyi hogi ya jo redirectUrl hai agar usko
    humne store karya hoga, toh user.js ka ander jo '/login' hai waha per passport session ka ander sa redirectUrl ko delete kar dega
    so basically hum jab bhi redirectUrl ko access krna ki kosis kr rha toh ya ek empty undefined value hogi , toh isiliya hum 
    middleware.js ka ander req.session.redirectUrl ki value ko LOCALS ma save kar lete hai aur locals aasa variable hai jo
    haar jagah accessible hota hai and humara passport ka pass access nhi hai local ko delete karna ka so we create new middleware
    in middleware.js*/
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res,next)=>{
    req.logout((err)=>{ /*ya apna aap ma call back leta hai as a parameter that means jaisa hee user
    logout ho jaye uska baad immediately kya kaam hona chahiya woh hum call back ka ander likhta hai*/
    if(err) {
    return next(err);
    }
    req.flash("success", "you are logged out!")
    res.redirect("/listings");
    })
    };