const User = require("../models/user");

  module.exports.rendersignupform  =  (req,res) => {
    res.render("users/signup.ejs");
  } ;
   
   module.exports.signup =  async(req,res) => {
    try{
     let{username, email, password} = req.body;
     const newuser = new User({email, username});
   const registereduser =  await User.register(newuser, password);
   console.log(registereduser);
   req.login(registereduser, (err) => {
     if(err){
       return next(err);
     }
     req.flash("success" , "welcome to wounderlust");
     res.redirect( "/listings");
   });
} catch(err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderloginform = (req,res) => {
    res.render("users/login.ejs");

  }; 

module.exports.login =  async (req,res) => {
    req.flash("success" , "Welcome back to wanderlust! ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 };

 module.exports.logout =  (req,res) => {
    req.logout((err) => {
      if(err) {
      return  next(err);
      }
      req.flash("success", "you are logged out!");
      res.redirect("/listings");
    })
  };