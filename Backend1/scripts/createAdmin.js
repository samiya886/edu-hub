import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

const createAdmin = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "EduAdmin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    console.log("Admin account is ready:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error("Unable to create admin account:", error.message);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
};

createAdmin();
