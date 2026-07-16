import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      process.env.DATABASE_URL;

    if (!mongoUri) {
      throw new Error(
        "MongoDB connection string is missing. Set MONGO_URI, MONGODB_URI, MONGO_URL, or DATABASE_URL in your deployment variables."
      );
    }

    if (/(YOUR_|<|>|username|password|cluster-name)/i.test(mongoUri)) {
      throw new Error(
        "MongoDB connection string still contains placeholder text. Replace it with your real MongoDB Atlas connection string."
      );
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    if (/bad auth|authentication failed/i.test(error.message)) {
      console.error(
        "Check the MongoDB Atlas database user's username/password, then update your MongoDB connection string."
      );
    }

    if (/IP.*whitelist|isn'?t whitelisted|Could not connect to any servers/i.test(error.message)) {
      console.error(
        "Check MongoDB Atlas Network Access and allowlist your current public IP address."
      );
    }

    return false;
  }
};

export default connectDB;
