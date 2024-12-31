const mongoose = require('mongoose');

// Function to connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        // Connecting to the MongoDB database using the URI from environment variables
        await mongoose.connect(process.env.MONGO_URI, {

        });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
