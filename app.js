if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");

const session=require('express-session');
const MongoStore = require("connect-mongo").default;
const flash=require('connect-flash');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const passport=require('passport');

const dbUrl=process.env.ATLASDB_URL;
main()
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SECRET,
  touchAfter: 24 * 3600,
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/", (req, res) => {
//     res.send("Hi,This is root");
// });


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.search=req.query.search || '';
    next();
});

//for listing router
app.use("/listings",listings);


//for review router
// /listings/:id/reviews ye common url prefix hai it will be added to beginning of router review
app.use("/listings/:id/reviews",reviews);
app.use("/",users);
//agar koi non existing route ko handle karne ke liye
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
});


app.listen(8080, () => {
    console.log("Running in 8080 Port");
});



// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My House",
//         description: "This is marvellous",
//         price: 1234,
//         location: "Garla",
//         country: "India"
//     });

//     await sampleListing.save();
//     res.send("Tested Successfully");
// });
