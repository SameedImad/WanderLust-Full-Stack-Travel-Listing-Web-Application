const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,IsLoggedIn,IsAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js")
//Review Post route
router.post("/",IsLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Review Delete route
router.delete("/:reviewId",IsLoggedIn,IsAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;

