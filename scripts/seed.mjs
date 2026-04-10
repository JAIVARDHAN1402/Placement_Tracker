/**
 * Database Seed Script
 * Run: node scripts/seed.mjs
 *
 * Seeds your MongoDB with the demo data (2 users, 5 companies, 5 applications).
 * WARNING: This clears existing data in Users, Companies, and Applications collections.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ── Schemas (inline to avoid Next.js import issues) ──

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ["student", "admin"] },
  branch: String,
}, { timestamps: true });

const companySchema = new mongoose.Schema({
  name: String,
  role: String,
  package: String,
  deadline: String,
  location: String,
  mode: { type: String, enum: ["Remote", "Hybrid", "On-site"] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isGlobal: Boolean,
  skills: [String],
}, { timestamps: true });

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  status: String,
  appliedDate: String,
  source: String,
  failureStage: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Company = mongoose.model("Company", companySchema);
const Application = mongoose.model("Application", applicationSchema);

// ── Seed Data ──

async function seed() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected!\n");

  // Clear existing data
  await User.deleteMany({});
  await Company.deleteMany({});
  await Application.deleteMany({});
  console.log("🗑️  Cleared existing data.\n");

  // Create users (passwords will be hashed)
  const hashedStudentPw = await bcrypt.hash("student123", 12);
  const hashedAdminPw = await bcrypt.hash("admin123", 12);

  const [student, admin] = await User.insertMany([
    {
      name: "Aarav Sharma",
      username: "aarav_sharma",
      password: hashedStudentPw,
      role: "student",
      branch: "B.Tech CSE",
    },
    {
      name: "Jai",
      username: "jai12345",
      password: hashedAdminPw,
      role: "admin",
      branch: "Training & Placement Cell",
    },
  ]);
  console.log(`👤 Created ${2} users:`);
  console.log(`   Student: aarav_sharma / student123`);
  console.log(`   Admin:   jai12345 / admin123\n`);

  // Create companies
  const companies = await Company.insertMany([
    {
      name: "Google",
      role: "Software Engineer Intern",
      package: "32 LPA",
      deadline: "2026-04-14",
      location: "Bengaluru",
      mode: "Hybrid",
      createdBy: admin._id,
      isGlobal: true,
      skills: ["DSA", "System Design", "JavaScript"],
    },
    {
      name: "Atlassian",
      role: "Frontend Engineer",
      package: "22 LPA",
      deadline: "2026-04-09",
      location: "Remote",
      mode: "Remote",
      createdBy: admin._id,
      isGlobal: true,
      skills: ["React", "Accessibility", "Testing"],
    },
    {
      name: "Razorpay",
      role: "Product Analyst",
      package: "17 LPA",
      deadline: "2026-04-20",
      location: "Bengaluru",
      mode: "On-site",
      createdBy: admin._id,
      isGlobal: true,
      skills: ["SQL", "Product Metrics", "Excel"],
    },
    {
      name: "Zepto",
      role: "SDE-1",
      package: "18 LPA",
      deadline: "2026-04-11",
      location: "Mumbai",
      mode: "Hybrid",
      createdBy: admin._id,
      isGlobal: true,
      skills: ["Node.js", "Backend", "Problem Solving"],
    },
    {
      name: "Stealth Startup",
      role: "Growth Intern",
      package: "8 LPA",
      deadline: "2026-04-18",
      location: "Pune",
      mode: "Remote",
      createdBy: student._id,
      isGlobal: false,
      skills: ["Communication", "Research", "Canva"],
    },
  ]);
  console.log(`🏢 Created ${companies.length} companies.\n`);

  // Create applications
  const apps = await Application.insertMany([
    {
      userId: student._id,
      companyId: companies[0]._id, // Google
      status: "Interview",
      appliedDate: "2026-03-28",
      source: "campus",
    },
    {
      userId: student._id,
      companyId: companies[1]._id, // Atlassian
      status: "Rejected",
      appliedDate: "2026-03-18",
      source: "campus",
      failureStage: "OA",
    },
    {
      userId: student._id,
      companyId: companies[4]._id, // Stealth Startup
      status: "Applied",
      appliedDate: "2026-03-30",
      source: "self",
    },
    {
      userId: student._id,
      companyId: companies[2]._id, // Razorpay
      status: "Selected",
      appliedDate: "2026-02-22",
      source: "campus",
    },
    {
      userId: student._id,
      companyId: companies[3]._id, // Zepto
      status: "Rejected",
      appliedDate: "2026-03-02",
      source: "campus",
      failureStage: "Interview",
    },
  ]);
  console.log(`📋 Created ${apps.length} applications.\n`);

  console.log("✅ Seed complete! Your database is ready.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
