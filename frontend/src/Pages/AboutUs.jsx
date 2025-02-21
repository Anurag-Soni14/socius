import React from "react";
import { FaUsers, FaBullseye, FaGlobe, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const teamMembers = [
  {
    name: "Anurag Soni",
    role: "Head of the Website",
    description: "Anurag leads the platform with a vision to innovate and enhance user experience.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIg56NMQftJsBVsWu-IBEoK2KeFo-U3G4I0abyVRx_owrgVqcawml4F8bY4hjKpmIFKc0&usqp=CAU", 
  },
  {
    name: "Darshan Dhameliya",
    role: "Partner",
    description: "Darshan plays a crucial role in shaping the platform’s strategic direction.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpIoI76wjvQ2pq6t25TLmRAwTxv118OFKZxykoCiY_fWRtR8QRr1nWWcDtG3tHdgCuWu8&usqp=CAU", 
  },
  {
    name: "Ronak Singh",
    role: "Partner",
    description: "Ronak focuses on platform growth and community engagement.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlytaSU4fbsRGwIQx2MzHILwGrWKNYEemGlzpQLmeRh2eR8yGMT_6SwNWsamNBLEVMYLc&usqp=CAU", 
  },
];

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Introduction */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-lg text-gray-700">A platform designed to connect people, share ideas, and build a vibrant community.</p>
      </section>

      {/* Mission Statement */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold flex items-center"><FaBullseye className="mr-2" /> Our Mission</h2>
        <p className="text-gray-700">To provide a secure and engaging social media experience that fosters meaningful connections.</p>
      </section>

      {/* Target Audience */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold flex items-center"><FaUsers className="mr-2" /> Our Audience</h2>
        <p className="text-gray-700">We cater to individuals, content creators, businesses, and organizations looking for a dynamic online presence.</p>
      </section>

      {/* Company Background */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Our Story</h2>
        <p className="text-gray-700">Founded with a vision to create a user-friendly and secure social networking platform, we have achieved multiple milestones in providing a seamless experience to our users.</p>
      </section>

      {/* Core Values */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Our Values</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Transparency</li>
          <li>Innovation</li>
          <li>Privacy and Security</li>
          <li>Community-driven growth</li>
        </ul>
      </section>

      {/* Features and Services */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Features & Services</h2>
        <p className="text-gray-700">We offer real-time messaging, content sharing, personalized feeds, and robust privacy settings.</p>
      </section>

      {/* Team Introduction */}
      <section>
        <h2 className="text-2xl font-semibold text-center mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img src={member.image} alt={member.name} className="w-40 h-40 mx-auto rounded-full object-cover" />
              <h3 className="text-lg font-semibold mt-3">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
              <p className="text-gray-700 mt-2">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision for the Future */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold flex items-center"><FaGlobe className="mr-2" /> Our Vision</h2>
        <p className="text-gray-700">To be a globally recognized platform where people connect, collaborate, and inspire.</p>
      </section>

      {/* Contact Information */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p className="text-gray-700 flex items-center"><FaEnvelope className="mr-2 text-blue-500" /> Email: <a href="mailto:support@yourwebsite.com" className="text-blue-500 hover:underline ml-1">support@besocius.com</a></p>
        <p className="text-gray-700 flex items-center"><FaPhoneAlt className="mr-2 text-green-500" /> Phone: +1-800-555-1234</p>
      </section>

      {/* Legal Information */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Legal Information</h2>
        <p className="text-gray-700">For details on our terms and policies, visit our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.</p>
      </section>
    </div>
  );
};

export default AboutUs;