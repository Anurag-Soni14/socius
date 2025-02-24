import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportType: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  });

export const Report = mongoose.model("Report", reportSchema);

