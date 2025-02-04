import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        process.exit(1); // Exit process on failure
    }
};

export default connectDB;
