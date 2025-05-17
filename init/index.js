const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");
const { ObjectId } = mongoose.Types;

main().then(
    () => {
        console.log("connected to database");
    }
).catch((err) => {
    console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    try {
        await listing.deleteMany({});
        // Create a valid ObjectId
        const ownerId = new ObjectId();
        
        // Create a new array with owner added to each object
        const mappedData = initData.data.map((obj) => ({
            ...obj, 
            owner:'68206ab73777d558d7641435'// Use the valid ObjectId
        }));
        
        // Insert the modified data
        const result = await listing.insertMany(mappedData);
        console.log(`Data was initialized - ${result.length} documents inserted`);
    } catch (error) {
        console.error("Error initializing database:", error);
    } finally {
        // Close the connection after operation completes
        mongoose.connection.close();
    }
}

initDB();