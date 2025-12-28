const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

const {reviewSchema,listingSchema}=require("./Schema.js");
const ExpressError=require("./utils/ExpressError.js");
module.exports.IsLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //url where we are logged for is stored in the original Url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","User must be Logged in!!");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        //local are accesible globally
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.IsOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You have no permission!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//validation on server side
//and pass this as a middleware
module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.IsAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You have not author!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
