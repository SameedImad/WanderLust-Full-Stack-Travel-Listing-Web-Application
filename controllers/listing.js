const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken:process.env.MAP_TOKEN });

module.exports.index = async (req, res) => {
  let search = req.query.search || "";
  let category = req.query.category || null;
  let allListings;
  if (search !== "") {
    allListings = await Listing.find({
      location: { $regex: search, $options: "i" }
    });
  } else if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }
  res.render("./listings/index.ejs", {
    allListings,
    category,
    search
  });
};
module.exports.renderNewForm=async (req, res) => {
    res.render("./listings/create_listing.ejs");
};

module.exports.createListing=async (req, res) => {
    let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit: 1,
    })
    .send()
    let url=req.file.path;
    let filename=req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner=req.user._id;
    newList.image={url,filename};
    newList.geometry=response.body.features[0].geometry;
    await newList.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const sample = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!sample){
        req.flash("error","Listing that requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { sample });
};
module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing that requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250,h_300");
    res.render("./listings/edit.ejs", { listing ,originalUrl});
};
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let updatedlisting=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedlisting.image={url,filename};
    await updatedlisting.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}
// module.exports.filters=async (req, res) => {
//         const { category } = req.query;
//         let listings;
//         if (category) {
//             listings = await Listing.find({ category });
//         } else {
//             listings = await Listing.find({});
//         }
//         res.render("listings/index.ejs", { listings, category });
//     }