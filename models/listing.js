const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        // type: String,
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }, ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

});
//post mongoose middleware
listingSchema.post("findOneAndDelete", async(listing) => {

    //isme us listing ka data aagya jo dlt krna he or us listing ke data k sath hum kuch action le skte he
    if (listing) {

        await Review.deleteMany({ _id: { $in: listing.reviews } }); //un reviews ko dlt krre jo humare listing k reviews k array me aate he
        //it will dlt review corrrosponding to is
    }
});

//model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; //export to app.js