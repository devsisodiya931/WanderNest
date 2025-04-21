const express = require("express");
const router = express.Router({mergeParams: true});
const wrapasync = require("../utils/wrapasync.js")
const expresserror = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isloggedin , isreviewauthor} = require("../middleware.js");


  const reviewcontollers = require("../controllers/reviews.js");
//Review
//post route
router.post("/" ,
   isloggedin,
   validateReview,
    wrapasync(reviewcontollers.createreview));
// delete route for reviews
    router.delete("/:reviewId" ,
        isloggedin,
        isreviewauthor,
          wrapasync(reviewcontollers.distroyreview));

   module.exports = router;