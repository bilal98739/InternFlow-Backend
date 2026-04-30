import User from "../models/User.js"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ msg: "Email and password are required" });

        const user = await User.findOne({ email });

        if (!user || user.password !== password)
            return res.status(400).json({ msg: "Invalid email or password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "secret123",
            { expiresIn: "7d" }
        );

        res.json({ token, role: user.role, name: user.name });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ msg: "Server error" });
    }
}