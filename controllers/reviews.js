const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createreview = async(req,res) =>{
   console.log(req.params.id);
   let listing =  await Listing.findById(req.params.id);
   let newreview = new Review(req.body.review);

   
   newreview.author= req.user._id;
   console.log(newreview);
   listing.reviews.push(newreview);
   await newreview.save();
   await listing.save();
   req.flash("success", "New review created!");

   res.redirect(`/listings/${listing._id}`);

};

module.exports.distroyreview = async (req,res) => {
   let { id, reviewId } = req.params;

 await  Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
 await Review.findByIdAndDelete(reviewId);
 req.flash("success", "Review Deleted!");

    res.redirect(`/listingS/${id}`);
}; 