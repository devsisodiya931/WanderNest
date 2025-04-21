const Listing = require("./models/listing");
const Review = require("./models/review");

const expresserror = require("./utils/expresserror.js")
const {listingSchema} = require("./schema.js");

const { reviewSchema} = require("./schema.js");

module.exports.isloggedin = (req,res,next) => {
   // console.log(req.path, ".." , );
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you are not the owner of this  listing");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
       req.flash("error" , "you don't have permission to edit");
      return  res.redirect(`/listings/${id}`);

    }
    next();
};

module.exports.validatelisting = (req, res , next) => {
    let {error} =  listingSchema.validate(req.body);
   // console.log(result);
    if(error) {
        let errmsg = error.details.map((el) => el.message).join(" ,");
        throw new expresserror( 400,errmsg);
    }else{
        next();
    }
};




module.exports.validateReview = (req, res , next) => {
    let {error} =  reviewSchema.validate(req.body);
   // console.log(result);
    if(error) {
        let errmsg = error.details.map((el) => el.message).join(" ,");
        throw new expresserror( 400,errmsg);
    }else{
        next();
    }   
};


module.exports.isreviewauthor = async(req,res,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
       req.flash("error" , "you are not the author of this review");
      return  res.redirect(`/listings/${id}`);

    }
    next();
};