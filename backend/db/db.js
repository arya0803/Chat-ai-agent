import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log("MongoDB URI:", process.env.MONGODB_URI);
function connect() {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
}

export default connect; 