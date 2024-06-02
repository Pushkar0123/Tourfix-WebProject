const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then( () => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
//Made Function
const initDB = async() => {
    await Listing.deleteMany({}); //delete the pre present data
    // Instead of adding owner object in each data we use this
    initData.data = initData.data.map((obj) => ({...obj, owner:"65e0fba43e347320d9f39722"}));
    /*initData ka ander hum pahle data array ko access karnga aur isse array ko access karka hum map function
    (ya function hmra array ka ander change nhi karta hai ya ek naya array create karta hai aur ya jo owner 
    propery insert hogi ya naya array ka nader store hogi) apply karenga aur map har ek individual object ka 
    liya (yani hmra array ka ander jo haar ek individual listing object hai un object ka ander ja ka ek nayi 
    property ko add kr dega) basically humari jo object hai usse hum convert kar rha hai to a new object, 
    jiska ander humri object ki toh sari property aygi hi aygi (mtib jo individual listing object ki sari property)
    but uska sath ma owner define kar denge with its id, aur jo map naya array banaya ga usse initData.data
    return kar dega, aur usse return kara ka hum same varable ma store karwa lenge */
    await Listing.insertMany(initData.data); //initData is alredy a object accessing key (i.e data) present in data.js last ma
    console.log("data was initialized");
};

initDB();