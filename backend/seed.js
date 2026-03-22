/**
 * Seed Script — run once to create initial users in MongoDB
 * Usage: node seed.js
 */

const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const User     = require("./models/User");
const Enquiry  = require("./models/Enquiry");

dotenv.config();

const USERS = [
  { name: "Admin User",  email: "admin@crm.com", password: "admin123", role: "admin" },
  { name: "Staff User",  email: "staff@crm.com", password: "staff123", role: "staff" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing
    await User.deleteMany({});
    await Enquiry.deleteMany({});
    console.log("🗑  Cleared existing users and enquiries");

    // Create users
    for (const u of USERS) {
      await User.create(u);
      console.log(`👤 Created user: ${u.email} (${u.role})`);
    }

    // Create sample enquiries
    const admin = await User.findOne({ role: "admin" });
    const sampleEnquiries = [
      {
        name: "Priya Sharma", phone: "9876543210", email: "priya@example.com",
        service: "Coaching", message: "Interested in career coaching sessions.",
        status: "Interested", createdBy: admin._id, createdByName: admin.name,
        followUps: [
          { note: "Called client, discussed package options.", addedByName: admin.name },
          { note: "Sent detailed brochure via email.", addedByName: admin.name },
        ],
      },
      {
        name: "Rahul Verma", phone: "9123456789", email: "rahul@example.com",
        service: "Software Dev", message: "Need a custom CRM for my business.",
        status: "Follow Up", createdBy: admin._id, createdByName: admin.name,
        followUps: [
          { note: "Initial call done, sent requirement form.", addedByName: admin.name },
        ],
      },
      {
        name: "Sunita Patel", phone: "9988776655", email: "sunita@example.com",
        service: "Marketing", message: "Looking for social media management.",
        status: "New Lead", createdBy: admin._id, createdByName: admin.name,
        followUps: [],
      },
      {
        name: "Amit Kumar", phone: "9001122334", email: "amit@example.com",
        service: "Design", message: "Need a logo and brand identity.",
        status: "Rejected", createdBy: admin._id, createdByName: admin.name,
        followUps: [
          { note: "Client budget too low, chose a freelancer.", addedByName: admin.name },
        ],
      },
    ];

    for (const enq of sampleEnquiries) {
      await Enquiry.create(enq);
      console.log(`📋 Created enquiry: ${enq.name}`);
    }

    console.log("\n✅ Seed complete!");
    console.log("─────────────────────────────────");
    console.log("Login credentials:");
    console.log("  Admin → admin@crm.com / admin123");
    console.log("  Staff → staff@crm.com / staff123");
    console.log("─────────────────────────────────");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
