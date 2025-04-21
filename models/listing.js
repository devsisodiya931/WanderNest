const mongoose = require("mongoose");
const Review = require("./review.js")

// Listing Schema
const listingSchema = new mongoose.Schema({
title: {
 type: String,
 required: true,
},
description: String,


image: {
 url: String,
 filename: String,
},

price: {
 type: Number,
},

location: {
 type: String,
},

country: {
 type: String,
},

// Correct way to store reviews (as ObjectId references)
reviews: [
 {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Review",
 },
],

owner: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User",
},
geometry: {
  type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ['Point'], // 'location.type' must be 'Point'
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
   },
 },
});

listingSchema.post("findOneAndDelete", async (listing) =>{
if(listing){
 await Review.deleteMany({_id : {$in: listing.reviews}});

};
})

// Export Listing model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;