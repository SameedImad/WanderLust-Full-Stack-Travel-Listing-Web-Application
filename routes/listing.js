if(process.env.NODE_EVM != "production"){
    require('dotenv').config()
}
const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {IsLoggedIn,IsOwner,validatelisting}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});
//for optimal we use router.route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single("listing[image]"),validatelisting,wrapAsync(listingController.createListing))


router.get("/new", IsLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get(listingController.showListing)
    .put(IsLoggedIn,IsOwner,upload.single("listing[image]"),validatelisting, wrapAsync(listingController.updateListing))
    .delete(IsLoggedIn,IsOwner,wrapAsync( listingController.destroyListing));

router.get("/:id/edit",IsLoggedIn,listingController.editListing);


module.exports=router;




// //index Route
// router.get("/",listingController.index);

// //new route
// router.get("/new", IsLoggedIn,listingController.renderNewForm);

// //create route
// router.post("/",validatelisting,wrapAsync(listingController.createListing));


// //show route 
// router.get("/:id", listingController.showListing);

// //edit
// router.get("/:id/edit",IsLoggedIn,IsOwner,listingController.editListing);

// //put route
// router.put("/:id",IsLoggedIn,IsOwner, wrapAsync(listingController.updateListing));

// //delete
// router.delete("/:id",IsLoggedIn,IsOwner,wrapAsync( listingController.destroyListing));


