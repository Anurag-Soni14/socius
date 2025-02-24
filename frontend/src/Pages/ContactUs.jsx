import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ContactUs = () => {
  const {user} = useSelector((store) => store.auth);
  const [formData, setFormData] = useState({ 
    name: user?.fullname, 
    email: user?.email, 
    subject: "", 
    message: "" 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/v1/user/contact-us", formData, { withCredentials: true });
      if(res.data.success){
        setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form on success
        toast.success("Message sent successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center">Contact Us</h1>
      <p className="text-center text-gray-600">We’d love to hear from you! Fill out the form below or reach out through other channels.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-base-100 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your Name" className="input input-bordered w-full" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email" className="input input-bordered w-full" value={formData.email} onChange={handleChange} required />
            <input type="text" name="subject" placeholder="Subject" className="input input-bordered w-full" value={formData.subject} onChange={handleChange} />
            <textarea name="message" placeholder="Your Message" className="textarea textarea-bordered w-full h-32" value={formData.message} onChange={handleChange} required></textarea>
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center" disabled={loading}>
              <FaPaperPlane className="mr-2" /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="bg-base-100 shadow-md rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold">Contact Information</h2>
          <p className="flex items-center"><FaEnvelope className="mr-2 text-primary" /> <a href="#" className="text-accent hover:underline">support@besocius.com</a></p>
          <p className="flex items-center"><FaPhoneAlt className="mr-2 text-primary" /> +1-800-555-1234</p>
          <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-primary" /> 123 Main Street, City, Country</p>
          
          {/* Social Media Links */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-primary text-2xl"><FaFacebook /></a>
              <a href="#" className="text-primary text-2xl"><FaTwitter /></a>
              <a href="#" className="text-primary text-2xl"><FaInstagram /></a>
              <a href="#" className="text-primary text-2xl"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p>Need quick help? Visit our <a href="/account/help" className="text-primary font-semibold">Help Center</a></p>
        <p>Read our <a href="/privacy-policy" className="text-primary font-semibold">Privacy Policy</a> and <a href="/terms" className="text-primary font-semibold">Terms of Service</a>.</p>
      </div>
    </div>
  );
};

export default ContactUs;
