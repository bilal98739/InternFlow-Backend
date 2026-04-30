import Task from "../models/Task.js";

// GET all tasks (admin sees all, intern sees own)
export const getTasks = async (req, res) => {
    try {
        const filter = req.user.role === "intern" ? { internId: req.user.id } : {};
        const tasks = await Task.find(filter)
            .populate("internId", "name email")
            .populate("assignedBy", "name")
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// GET tasks for a specific intern
export const getInternTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ internId: req.params.internId })
            .populate("internId", "name email")
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// CREATE / ASSIGN task (admin only)
export const createTask = async (req, res) => {
    try {
        const { title, description, internId, priority, deadline } = req.body;
        if (!title || !internId)
            return res.status(400).json({ msg: "Title and intern are required" });

        const task = await Task.create({
            title, description, internId, priority, deadline,
            assignedBy: req.user.id,
            status: "Pending"
        });
        const populated = await task.populate("internId", "name email");
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// UPDATE task (admin can update all; intern can only submit)
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        let update = {};

        if (req.user.role === "admin") {
            // Admin can update everything
            const { title, description, internId, priority, deadline, status } = req.body;
            update = { title, description, internId, priority, deadline, status };
        } else {
            // Intern can only submit link and change status to Submitted
            if (task.internId.toString() !== req.user.id)
                return res.status(403).json({ msg: "Not your task" });
            const { submittedLink } = req.body;
            update = { submittedLink, status: "Submitted" };
        }

        const updated = await Task.findByIdAndUpdate(req.params.id, update, { new: true })
            .populate("internId", "name email")
            .populate("assignedBy", "name");
        res.json(updated);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// DELETE task (admin only)
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });
        res.json({ msg: "Task deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
