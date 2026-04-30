import mongoose from "mongoose"

const schema = new mongoose.Schema({
    title:         { type: String, required: true },
    description:   { type: String, default: "" },
    status:        { type: String, enum: ["Pending", "In Progress", "Submitted", "Completed", "Rejected"], default: "Pending" },
    priority:      { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    deadline:      { type: Date },
    submittedLink: { type: String, default: "" },
    internId:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true })

export default mongoose.model("Task", schema)