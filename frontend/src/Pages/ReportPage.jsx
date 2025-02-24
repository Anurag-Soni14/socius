import React, { useState } from "react";
import { FaCheckCircle, FaInfoCircle, FaUpload, FaTimes } from "react-icons/fa";
import axios from "axios";

const ReportPage = () => {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!reportType) {
      setError("Please select an issue type.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a description.");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      const formData = new FormData();
      formData.append("reportType", reportType);
      formData.append("description", description);
      if (file) {
        formData.append("image", file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/v1/user/report", 
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSubmitted(true);
        setReportType("");
        setDescription("");
        setFile(null);
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center">Report Content</h1>
      <p className="text-center text-gray-700">
        Help us maintain a safe community by reporting inappropriate content.
      </p>

      <div className="bg-base-200 p-4 rounded-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" /> Reporting Guidelines
        </h2>
        <p className="text-gray-600">
          Please review our{" "}
          <a href="#" className="text-blue-500 underline">
            Community Guidelines
          </a>{" "}
          before submitting a report.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-green-100 rounded-lg text-center">
          <FaCheckCircle className="text-green-600 text-4xl mx-auto" />
          <p className="mt-2 font-semibold">
            Your report has been submitted successfully.
          </p>
          <p className="text-gray-600">
            We will review it within 24 hours. Thank you for helping us keep the
            community safe.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <FaTimes className="text-red-600" /> {error}
            </div>
          )}

          <div>
            <label className="block font-medium">Select Issue Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Choose an option</option>
              <option value="harassment">Harassment or Bullying</option>
              <option value="hate">Hate Speech</option>
              <option value="spam">Spam or Scams</option>
              <option value="fake">Fake Account</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Describe the Issue:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows="4"
              placeholder="Provide details..."
            ></textarea>
          </div>

          {/* Custom File Upload */}
          <div>
            <label className="block font-medium">Upload Evidence (optional):</label>
            <div className="relative mt-2">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition"
              >
                <FaUpload className="text-blue-500" />{" "}
                {file ? file.name : "Choose File"}
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary">
              Submit Report
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setReportType("");
                setDescription("");
                setFile(null);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportPage;
