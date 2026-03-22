const mongoose = require("mongoose");

const FollowUpSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: [true, "Follow-up note is required"],
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    addedByName: {
      type: String,
    },
  },
  { timestamps: true }
);

const EnquirySchema = new mongoose.Schema(
  {
    enquiryId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      enum: ["Coaching", "Consulting", "Software Dev", "Marketing", "Design", "Other"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["New Lead", "Follow Up", "Interested", "Passed", "Rejected"],
      default: "New Lead",
    },
    followUps: [FollowUpSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdByName: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-generate enquiryId before saving
EnquirySchema.pre("save", async function (next) {
  if (!this.enquiryId) {
    this.enquiryId = "ENQ-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Enquiry", EnquirySchema);
