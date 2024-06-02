const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Require review for deletion purpose
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:String,
    image: {
        // type:String,
        // default: // Agar image aa hi nhi rhi ho toh uska liye ya kiya
        //     "https://images.unsplash.com/photo-1588001832198-c15cff59b078?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9",
        
        // // Jab image toh aa rahi hai per image(link empty hai) khali hai
        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1588001832198-c15cff59b078?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9" : v,

        // After completing image upload function 
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    // After making review.js for listing details (one to many)
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review", //reference
        },
    ],
    // For authenitcation process --- Owner property
    owner: { /*owner user.js wala schema ko refer karya ga ku ki jo listing ka owner hai woh hamra platform per
    ek register user bhi hona chaiya*/
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // Using GeoJSON in mapping
    geometry: {
        type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
        },
        coordinates: {
        type: [Number],
        required: true
        }
    },
    // category: {
    //     type:String,
    //     enum: ["mountains","artic", "farms", "deserts"]
    // }
});

//For deleting database of review after deleteing the whole listing (Mongoose Middleware)
listingSchema.post("findOneandDelete", async(listing) =>{
    // listing.review ka ander jitna bhi id hai unki list bana lenga aur hamara _id uska part hogi toh pura ka pura id delete ho jayega.
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;