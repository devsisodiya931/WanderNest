const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const {isloggedin, isOwner, validatelisting} = require("../middleware.js");

const listincontroller = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage });


router
.route("/")
.get( wrapasync(listincontroller.index) )
.post(
   isloggedin,
 
    upload.single('listing[image]'),
    validatelisting,
    wrapasync(listincontroller.createlisting ));

 // new route 
 router.get("/new" , isloggedin, listincontroller.rendernewform);

    router
    .route("/:id")
    .get( wrapasync(listincontroller.showlisting))
    .put(isloggedin, 
     isOwner,
     upload.single('listing[image]'),
      validatelisting, 
      wrapasync( listincontroller.updatelisting)
     )
    .delete(isloggedin, isOwner, wrapasync(listincontroller.distroylisting));
          

//edit route

router.get("/:id/edit",
    isloggedin,
    isOwner,
     wrapasync(listincontroller.editlisting));

// delete route
router
module.exports = router;
