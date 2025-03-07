import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const AdminEditReport = () => {
  const reportId = useParams().id;
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/report/admin/get-report/${reportId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setReport(res.data.report);
          setStatus(res.data.status);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, [reportId]);

  const handleUpdate = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/report/admin/edit/${reportId}`,
        { withCredentials: true, data: { status } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/reports");
      }
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  if (!report) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold">Report Details</h2>
      <p>
        <strong>Type:</strong> {report.reportType}
      </p>
      <p>
        <strong>Description:</strong> {report.description}
      </p>
      <p>
        <strong>User ID:</strong> {report.user}
      </p>
      {report.image && (
        <img
          src={report.image}
          alt="Report"
          className="mt-2 w-full h-64 object-cover rounded"
        />
      )}
      <p>
        <strong>Status:</strong> {report.status}
      </p>

      <div className="mt-4">
        <label className="block mb-2">Update Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="canceled">Canceled</option>
        </select>
        <button
          onClick={handleUpdate}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Report
        </button>
      </div>
    </div>
  );
};

export default AdminEditReport;
