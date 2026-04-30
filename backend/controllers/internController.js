import User from "../models/User.js";

// GET all interns
export const getInterns = async (req, res) => {
    try {
        const interns = await User.find({ role: "intern" }).select("-password").sort({ createdAt: -1 });
        res.json(interns);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// GET single intern
export const getIntern = async (req, res) => {
    try {
        const intern = await User.findById(req.params.id).select("-password");
        if (!intern) return res.status(404).json({ msg: "Intern not found" });
        res.json(intern);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// CREATE intern
export const createIntern = async (req, res) => {
    try {
        const { name, email, password, skills, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ msg: "Name, email and password are required" });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: "Email already in use" });

        const intern = await User.create({ name, email, password, skills, phone, role: "intern" });
        const { password: _, ...data } = intern.toObject();
        res.status(201).json(data);
    } catch (err) {
        console.error("Create intern error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

// UPDATE intern
export const updateIntern = async (req, res) => {
    try {
        const { name, email, skills, phone, password } = req.body;
        const update = { name, email, skills, phone };
        if (password) update.password = password;

        const intern = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
        if (!intern) return res.status(404).json({ msg: "Intern not found" });
        res.json(intern);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// DELETE intern
export const deleteIntern = async (req, res) => {
    try {
        const intern = await User.findByIdAndDelete(req.params.id);
        if (!intern) return res.status(404).json({ msg: "Intern not found" });
        res.json({ msg: "Intern deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
