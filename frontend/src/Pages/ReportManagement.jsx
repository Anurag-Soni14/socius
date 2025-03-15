import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { FaEdit, FaTrash, FaSort } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ReportManagement = () => {
  const navigate = useNavigate();
  const [reportStats, setReportStats] = useState({
    totalReports: 0,
    newReportsToday: 0,
    pendingReports: 0,
    resolvedReports: 0,
    canceledReports: 0,
  });
  const [reports, setReports] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    fetchReportStats();
    fetchReports();
  }, []);

  const fetchReportStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/report/admin/report-stats",
        { withCredentials: true }
      );
      setReportStats(res.data.reportStats);
    } catch (error) {
      console.error("Error fetching report stats", error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/report/admin/fetch-report",
        { withCredentials: true }
      );
      if (res.data.success) {
        setReports(res.data.reports);
        setFilteredReports(res.data.reports);
      }
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredReports(
      reports.filter((report) =>
        report.reportType.toLowerCase().includes(value)
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/report/admin/delete/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        fetchReports();
        setOpenDialog(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error deleting report", error);
    } finally {
      setOpenDialog(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Report Stats & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-100 shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Report Statistics</h2>
          <Bar
            data={{
              labels: [
                "Total Reports",
                "New Reports Today",
                "Pending",
                "Resolved",
                "Canceled",
              ],
              datasets: [
                {
                  label: "Report Stats",
                  data: [
                    reportStats.totalReports,
                    reportStats.newReportsToday,
                    reportStats.pendingReports,
                    reportStats.resolvedReports,
                    reportStats.canceledReports,
                  ],
                  backgroundColor: [
                    "#4caf50",
                    "#ff9800",
                    "#f44336",
                    "#2196F3",
                    "#9C27B0",
                  ],
                },
              ],
            }}
          />
        </div>
        <div className="bg-base-100 shadow-md p-6 rounded-lg flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Report Stats Overview</h2>
          <p>
            Total Reports:{" "}
            <span className="font-bold">{reportStats.totalReports}</span>
          </p>
          <p>
            New Reports Today:{" "}
            <span className="font-bold">{reportStats.newReportsToday}</span>
          </p>
          <p>
            Pending Reports:{" "}
            <span className="font-bold">{reportStats.pendingReports}</span>
          </p>
          <p>
            Resolved Reports:{" "}
            <span className="font-bold">{reportStats.resolvedReports}</span>
          </p>
          <p>
            Canceled Reports:{" "}
            <span className="font-bold">{reportStats.canceledReports}</span>
          </p>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-base-100 shadow-md p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search reports..."
            className="p-2 border rounded-lg"
            value={searchText}
            onChange={handleSearch}
          />
        </div>
        <div className="overflow-auto max-h-96">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-base-300 shadow-md">
              <tr>
                <th className="p-4 text-start">Sr. No.</th>
                <th className="p-4 text-start">Report Type</th>
                <th className="p-4 text-start">User</th>
                <th className="p-4 text-start">Status</th>
                <th className="p-4 text-start">Created At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports?.map((report, index) => (
                <tr key={report._id} className="even:bg-base-200 odd:bg-base-100">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{report.reportType}</td>
                  <td className="p-4">{report.user.username}</td>
                  <td className="p-4">{report.status}</td>
                  <td className="p-4">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex justify-center items-center gap-4">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/report/${report._id}/edit`)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelectedReport(report);
                        setOpenDialog(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          onInteractOutside={() => setOpenDialog(false)}
          className="max-w-xl p-0 flex flex-col bg-base-100 text-base-content"
        >
          <VisuallyHidden>
            <DialogTitle>confirm delete</DialogTitle>
            <DialogDescription>
              admin confirmation for delete the report
            </DialogDescription>
          </VisuallyHidden>
          <div className="flex flex-col justify-center items-center p-6 gap-4">
            <div className="text-xl font-bold">
              <p>Are you sure to delete {selectedReport?.user?.username} ?</p>
            </div>
            <div className="flex gap-10 justify-center">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  handleDelete(selectedReport?._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportManagement;
