import { Report } from "../models/report.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/data-uri.js";


export const submitReport = async (req, res) => {
  try {
    const { reportType, description } = req.body;
    const image = req.file;
    const userId = req.id;

    if (!reportType || !description) {
      return res
        .status(400)
        .json({ message: "Report must contain a type and description" });
    }

    let imageUrl = "";
    if (image) {
      const fileUri = getDataUri(image);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      imageUrl = cloudResponse.secure_url;
    }

    const report = await Report.create({
      reportType,
      description,
      image: imageUrl,
      user: userId,
    });

    return res.status(201).json({
      message: "Report submitted successfully",
      report,
      success: true,
    });
  } catch (error) {
    console.error("Error in addNewReport:", error);
    return res.status(500).json({
      message: "Something went wrong while submitting the report.",
      error: error.message,
      success: false,
    });
  }
};

export const fetchReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user", "username email");
    return res.json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const getReportStats = async (req, res) => {
    try {
      const totalReports = await Report.countDocuments();
  
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
  
      const newReportsToday = await Report.countDocuments({ createdAt: { $gte: today } });
      const pendingReports = await Report.countDocuments({ status: "pending" });
      const resolvedReports = await Report.countDocuments({ status: "resolved" });
      const canceledReports = await Report.countDocuments({ status: "canceled" });
  
      const reportStats = {
        totalReports,
        newReportsToday,
        pendingReports,
        resolvedReports,
        canceledReports,
      };
      return res.json({
        success: true,
        reportStats,
      });
  
    } catch (error) {
      console.error("Error fetching report stats:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    return res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const editReport = async (req, res) => {
  try {
      const reportId = req.params.id;
      const { status } = req.body;

      if (!["pending", "resolved", "canceled"].includes(status)) {
          return res.status(400).json({ message: "Invalid status value" });
      }

      const report = await Report.findById(reportId);
      if (!report) {
          return res.status(404).json({ message: "Report not found" });
      }

      report.status = status;
      await report.save();

      res.json({ message: "Report status updated successfully", success:true, report });
  } catch (error) {
      res.status(500).json({ message: "Internal server error" });
  }
};

export const getSingleReport = async (req, res) => {
  try {
    const id = req.params.id;
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    return res.json({ success: true, report });
  } catch (error) {
    console.error("Error fetching report:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}