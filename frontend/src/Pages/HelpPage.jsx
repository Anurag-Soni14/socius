import React, { useState } from "react";
import {
  FaSearch,
  FaQuestionCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaUserShield,
  FaCogs,
  FaHeadset,
  FaBookOpen,
  FaGlobe,
  FaCommentDots,
} from "react-icons/fa";

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "Go to the login page and click 'Forgot Password' to reset your password.",
    },
    {
      question: "How can I update my profile information?",
      answer: "Navigate to your profile settings to update your information.",
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Use the 'Report' button available on posts and profiles.",
    },
    {
      question: "Can I change my username?",
      answer:
        "Usernames are unique and cannot be changed after account creation.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "You can request account deletion from the settings page. Your data will be permanently removed.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-bold text-primary text-center">
        Help & Support
      </h1>
      <p className="text-center text-base-content max-w-2xl mx-auto">
        Find answers, learn best practices, and get in touch with our support
        team.
      </p>

      <div className="relative w-full md:w-2/3 mx-auto">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for help..."
          className="w-full p-3 pl-12 border rounded-lg shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SectionCard
          icon={<FaBookOpen />}
          title="Getting Started"
          text="Learn how to set up and use your account."
        />
        <SectionCard
          icon={<FaUserShield />}
          title="Privacy & Security"
          text="Manage your security settings and privacy preferences."
        />
        <SectionCard
          icon={<FaCogs />}
          title="Account Settings"
          text="Modify your account details and preferences."
        />
      </div>

      <div className="card bg-base-200 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
          <FaQuestionCircle className="mr-2" /> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-arrow border border-base-300 rounded-lg"
            >
              <input
                type="checkbox"
                checked={openFAQ === index}
                onChange={() => toggleFAQ(index)}
              />
              <div className="collapse-title text-lg font-medium text-base-content">
                {faq.question}
              </div>
              <div className="collapse-content text-base-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-base-200 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
          <FaHeadset className="mr-2" /> Contact Support
        </h2>
        <p className="text-base-content flex items-center">
          <FaEnvelope className="mr-2 text-accent" /> Email:{" "}
          <a
            href="mailto:support@yourwebsite.com"
            className="text-accent hover:underline ml-1"
          >
            support@yourwebsite.com
          </a>
        </p>
        <p className="text-base-content flex items-center mt-2">
          <FaPhoneAlt className="mr-2 text-success" /> Phone:{" "}
          <span className="ml-1">+1-800-555-1234</span>
        </p>
      </div>

      <div className="card bg-base-200 shadow-md rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
          <FaCommentDots className="mr-2" /> Community Support
        </h2>
        <p className="text-base-content">
          Ask questions and get help from other users.
        </p>
        <a href="#" className="mt-2 text-accent hover:underline">
          Visit our Community Forum
        </a>
      </div>

      <div className="card bg-base-200 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
          <FaGlobe className="mr-2" /> Multi-Language Support
        </h2>
        <p className="text-base-content">
          Select your preferred language for better assistance.
        </p>
        <select className="mt-2 select select-bordered">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
      </div>
    </div>
  );
};

const SectionCard = ({ icon, title, text }) => (
  <div className="card bg-base-200 shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
    <div className="text-4xl mb-3 text-primary">{icon}</div>
    <h3 className="text-xl font-semibold text-base-content mb-2">{title}</h3>
    <p className="text-base-content">{text}</p>
  </div>
);

export default HelpPage;
