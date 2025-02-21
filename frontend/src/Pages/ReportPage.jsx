import React, { useState } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaTimes, FaInfoCircle, FaUpload } from "react-icons/fa";

const ReportPage = () => {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center">Report Content</h1>
      <p className="text-center text-gray-700">Help us maintain a safe community by reporting inappropriate content.</p>
      
      <div className="bg-base-200 p-4 rounded-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" /> Reporting Guidelines
        </h2>
        <p className="text-gray-600">Please review our <a href="#" className="text-blue-500 underline">Community Guidelines</a> before submitting a report.</p>
      </div>
      
      {submitted ? (
        <div className="p-6 bg-green-100 rounded-lg text-center">
          <FaCheckCircle className="text-green-600 text-4xl mx-auto" />
          <p className="mt-2 font-semibold">Your report has been submitted successfully.</p>
          <p className="text-gray-600">We will review it within 24 hours. Thank you for helping us keep the community safe.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium">Select Issue Type:</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full p-2 border rounded-lg">
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
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" rows="4" placeholder="Provide details..."></textarea>
          </div>
          
          <div>
            <label className="font-medium flex items-center gap-2">
              <FaUpload className="text-blue-500" /> Upload Evidence (optional):
            </label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mt-2" />
          </div>
          
          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary">Submit Report</button>
            <button type="button" className="btn btn-secondary" onClick={() => { setReportType(""); setDescription(""); setFile(null); }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportPage;
