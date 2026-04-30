import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/stats", auth, async (req, res) => {
  try {
    const totalInterns = await User.countDocuments({ role: "intern" });
    const totalTasks   = await Task.countDocuments();
    const pending      = await Task.countDocuments({ status: "Pending" });
    const inProgress   = await Task.countDocuments({ status: "In Progress" });
    const submitted    = await Task.countDocuments({ status: "Submitted" });
    const completed    = await Task.countDocuments({ status: "Completed" });
    const rejected     = await Task.countDocuments({ status: "Rejected" });

    // Monthly task data for the last 6 months
    const now = new Date();
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const month = d.toLocaleString("default", { month: "short" });
      const count = await Task.countDocuments({ createdAt: { $gte: d, $lt: end } });
      const done  = await Task.countDocuments({ status: "Completed", createdAt: { $gte: d, $lt: end } });
      monthlyData.push({ month, tasks: count, completed: done });
    }

    res.json({ totalInterns, totalTasks, pending, inProgress, submitted, completed, rejected, monthlyData });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ interns: [], tasks: [] });

    const regex = new RegExp(q, "i");
    
    // Search interns (only admins should see all interns, but for simplicity we'll allow search, interns might want to search tasks)
    const interns = req.user.role === "admin" 
      ? await User.find({ role: "intern", $or: [{ name: regex }, { email: regex }] }).select("name email").limit(5)
      : [];

    // Search tasks
    const taskFilter = req.user.role === "intern" ? { internId: req.user.id, title: regex } : { title: regex };
    const tasks = await Task.find(taskFilter).select("title status priority").limit(5);

    res.json({ interns, tasks });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;