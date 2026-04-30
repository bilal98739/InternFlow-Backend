import mongoose from "mongoose";
import User from "./models/User.js";

await mongoose.connect("mongodb://localhost:27017/internflow");
console.log("MongoDB Connected");

// Clear existing users first
await User.deleteMany({});

// Insert test users
await User.insertMany([
  {
    name: "Admin User",
    email: "admin@internflow.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Intern User",
    email: "intern@internflow.com",
    password: "intern123",
    role: "intern",
  },
]);

console.log("✅ Seed complete! Users created:");
console.log("   Admin  → admin@internflow.com  / admin123");
console.log("   Intern → intern@internflow.com / intern123");

await mongoose.disconnect();
process.exit(0);
