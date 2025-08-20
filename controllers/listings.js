const Listing = require("../models/listing.js");
module.exports.index = async(req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
};


module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
};

module.exports.ShowListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async(req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // current user ko owner bana diya
        newListing.image = { url, filename }; // image cloudinary se add

        await newListing.save(); // 🚀 ab DB me save hoga

        req.flash("success", "New Listing Created!");
        res.redirect(`/listings/${newListing._id}`); // new listing page pe redirect
    } catch (err) {
        next(err);
    }
};



module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params;
    // req.flash("success", " Listing Edited!");
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_200");

    res.render("listings/edit", { listing, originalImageUrl });

    // let originalImageUrl = listing.image.url;
    // originalImageUrl.replace("/upload", "/upload/h_100,w_70");

    // res.render("listings/edit", { listing, originalImageUrl });
};


module.exports.updateListing = async(req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });

    if (typeof req.file !== "undefined") { //js ka ndr hume chekc krna rha ki kisiki value undefine he ya  nhi we use typeof operator to check it its undefineeo or not

        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();

    }
    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${ id }`);

};


module.exports.deleteListing = async(req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
};








//{"fieldname":"listing[image]","originalname":"Screenshot 2024-07-25 160854.png",
// "encoding":"7bit","mimetype":"image/png",
// "path":"https://res.cloudinary.com/dtqi7djgv/image/upload/v1755244041/some-folder-name/xidwoodwn2wivhgypdyl.png","size":490399,
// "filename":"some-folder-name/xidwoodwn2wivhgypdyl"}