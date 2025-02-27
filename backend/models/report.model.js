import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportType: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ["pending", "resolved", "canceled"], 
        default: "pending" // All reports start as pending
    },
    createdAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model("Report", reportSchema);
