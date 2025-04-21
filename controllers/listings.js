// const { listingSchema } = require("../schema.js"); 
const { query, response } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// const expresserror = require("../utils/expresserror.js"); 

 module.exports.index = async (req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
};

  module.exports.rendernewform = (req,res) => {
    res.render("listings/new.ejs");
    };

    module.exports.showlisting = async(req,res) => {
      let {id} = req.params;
     const listing = await Listing.findById(id)
     .populate({
         path: "reviews",
         populate:{
            path:"author", 
         },
     })
     .populate("owner");
     if(!listing){
         req.flash("error", "Listing you requested for does not exist!");
         res.redirect("/listings");
     }
     console.log(listing);
     res.render("listings/show.ejs" , {listing});
  };

  module.exports.createlisting = async (req,res,next) => {
   let response = await geocodingClient
   .forwardGeocode ({ 
    query: req.body.listing.location,
    limit: 1,
   })
   .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing =  await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings");
     
 };

 module.exports.rendereditlisting =  async(req,res) => {
      let {id} = req.params;
      const listing = await Listing.findById(id);
      if(!listing){
         req.flash("error", "Listing you requested for does not exist!");
         res.redirect("/listings");
     }

     let originalimageurl =  listing.image.url;
   originalimageurl =   originalimageurl.replace("/upload", "/upload/w_250");
      res.render("listings/edit.ejs" , {listing, originalimageurl});
  
  };

  module.exports.updatelisting = async(req,res) => {
 let {id} = req.params;   
 let listing =  await  Listing.findByIdAndUpdate(id , {...req.body.listing});

 if(typeof req.file !== "undefined"){
 let url = req.file.path;
 let filename = req.file.filename;
 listing.image = {url, filename};
 await listing.save();
}
  req.flash("success", "Listing updeted!");

  res.redirect(`/listings/${id}`);
};

// delete listing 

module.exports.distroylisting =  async(req,res) => {
  let {id} = req.params;
let deletedlisting = await Listing.findByIdAndDelete(id);
console.log(deletedlisting);
req.flash("success", "Listing Deleted!");

res.redirect("/listings");
};



