import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";

const ContactManagement = () => {
  const navigate = useNavigate();
  const [contactStats, setContactStats] = useState({
    totalMessages: 0,
    newMessages: 0,
  });
  const [contacts, setContacts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    fetchContactStats();
    fetchContacts();
  }, []);

  const fetchContactStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/user/admin/contact-stats",
        { withCredentials: true }
      );
      setContactStats(res.data.contactStats);
    } catch (error) {
      console.error("Error fetching contact stats", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/user/admin/get-contacts",
        { withCredentials: true }
      );
      setContacts(res.data.contacts);
      setFilteredContacts(res.data.contacts);
    } catch (error) {
      console.error("Error fetching contacts", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredContacts(
      contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(value) ||
          contact.email.toLowerCase().includes(value)
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/user/admin/delete-contact/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchContacts();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error deleting contact", error);
    } finally {
      setOpenDialog(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-100 shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contact Stats</h2>
          <Bar
            data={{
              labels: ["New Messages", "Total Messages"],
              datasets: [
                {
                  label: "Contact Stats",
                  data: [
                    contactStats?.newMessagesToday,
                    contactStats?.totalMessages,
                  ],
                  backgroundColor: ["#4caf50", "#ff9800"],
                },
              ],
            }}
          />
        </div>
        <div className="bg-base-100 shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Contact Overview</h2>
          <p>
            New Messages:{" "}
            <span className="font-bold">{contactStats?.newMessagesToday}</span>
          </p>
          <p>
            Total Messages:{" "}
            <span className="font-bold">{contactStats?.totalMessages}</span>
          </p>
        </div>
      </div>
      <div className="bg-base-100 shadow-md p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search contacts..."
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
                <th className="p-4 text-start">Name</th>
                <th className="p-4 text-start">Email</th>
                <th className="p-4 text-start">Subject</th>
                <th className="p-4 text-start">Received At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact, index) => (
                <tr key={contact._id} className="even:bg-base-200 odd:bg-base-100">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{contact.name}</td>
                  <td className="p-4">{contact.email}</td>
                  <td className="p-4">
                    {contact.subject}
                  </td>
                  <td className="p-4">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex justify-center items-center gap-4">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/contact/${contact._id}/view`)
                      }
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelectedContact(contact);
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
        <DialogContent className="max-w-xl p-0 bg-base-100 text-base-content">
          <VisuallyHidden>
            <p>Confirm delete</p>
          </VisuallyHidden>
          <div className="p-6 flex flex-col gap-4 items-center">
            <p className="text-xl font-bold">
              Are you sure to delete {selectedContact?.name}?
            </p>
            <div className="flex gap-10">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(selectedContact?._id)}
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

export default ContactManagement;
