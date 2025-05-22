const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRediectUrl } = require("../middleware.js");

//SignUP
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup" , wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);

        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            else{
                req.flash("success","Welcome to WanderLust");
                res.redirect("/listings");
            }
        });
    }
    catch(e){
        e.message = "A user with given username already exists";
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//Login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login", saveRediectUrl ,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

//Logout
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        else{
            req.flash("success","Logged out successfully");
            res.redirect("/listings");
        }
    })
});


module.exports = router;