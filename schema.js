/* "Joi" ki help sa hum ek schema define karta hai aur ya jo schema hota hein ya hamara mongoose ka schema nhi hota,
ya hamara server side validation ka liya schema hota hai bhi tak humne client side validation toh kar hi liya hai
per server side validation ka liya yani schema validation ka liya hum apna tool ko use karenge jiska naam hai joi hai*/

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.string().required().min(0),
        image: Joi.string().allow("" , null),
    }).required(),
});
// Apna schema banyanga 
module.exports.reviewSchema = Joi.object({ //review ek joi ka object hai jo khud bhi ek object hoga
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(), //review required (request jab aaya tab uska ander review naam ka object hona hi chaiya) bhi hona chahiya */
})
