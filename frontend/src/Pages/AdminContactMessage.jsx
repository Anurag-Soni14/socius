import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AdminContactMessage = () => {
  const id = useParams().id;
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/user/admin/get-contact/${id}`, { withCredentials: true });
      setContact(res.data.contact);
    } catch (error) {
      console.error("Error fetching contact details", error);
    }
  };

  if (!contact) {
    return <p className="text-center p-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-base-100 shadow-md rounded-lg">
      <button className="mb-4 flex items-center gap-2 text-gray-700 hover:text-gray-900" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Contact Message Details</h2>
      <div className="space-y-4">
        <p><strong>Name:</strong> {contact.name}</p>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Subject:</strong> {contact.subject || "No subject"}</p>
        <p><strong>Message:</strong></p>
        <div className="p-4 bg-gray-100 rounded-lg border">{contact.message}</div>
        <p className="text-sm text-gray-500">Submitted on: {new Date(contact.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminContactMessage;
