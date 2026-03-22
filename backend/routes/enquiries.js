const express  = require("express");
const Enquiry  = require("../models/Enquiry");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// ── GET /api/enquiries ────────────────────────────────────────────────────────
// Get all enquiries (with optional search & status filter)
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/enquiries/stats ──────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const total      = await Enquiry.countDocuments();
    const newLead    = await Enquiry.countDocuments({ status: "New Lead" });
    const followUp   = await Enquiry.countDocuments({ status: "Follow Up" });
    const interested = await Enquiry.countDocuments({ status: "Interested" });
    const passed     = await Enquiry.countDocuments({ status: "Passed" });
    const rejected   = await Enquiry.countDocuments({ status: "Rejected" });

    res.json({ success: true, data: { total, newLead, followUp, interested, passed, rejected } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/enquiries/:id ────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/enquiries ───────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const enquiry = await Enquiry.create({
      name, phone, email, service, message,
      createdBy: req.user._id,
      createdByName: req.user.name,
    });

    res.status(201).json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/enquiries/:id/status ─────────────────────────────────────────────
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["New Lead", "Follow Up", "Interested", "Passed", "Rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/enquiries/:id/followup ─────────────────────────────────────────
router.post("/:id/followup", async (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: "Follow-up note is required" });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });

    enquiry.followUps.push({
      note: note.trim(),
      addedBy: req.user._id,
      addedByName: req.user.name,
    });

    await enquiry.save();
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/enquiries/:id ─────────────────────────────────────────────────
// Admin only
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
    res.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
