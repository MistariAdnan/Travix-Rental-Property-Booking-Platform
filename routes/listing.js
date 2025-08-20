const express = require("express");
const router = express.Router();

if (process.env.NODE_ENV != "production") {

    require('dotenv').config();
}
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
// const { isLoggedIn } = require("../middleware.js");
const { isLoggedIn, isOwner, validateListing, validateReview, isReviewAuthor } = require("../middleware.js");


const listingController = require("../controllers/listings.js")
    //multer
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

//index route
//create route
router.route("/").get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing, wrapAsync(listingController.createListing));
// router.route("/").get(wrapAsync(listingController.index))
//     .post(upload.single('listing[image]'), (req, res) => {
//         res.send(req.file);
//     });



//multer process img data req.file me data leke aayega
//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


//show route    
//update route
//delete route

router.route("/:id").get(wrapAsync(listingController.ShowListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))





//edit route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;