import React, { useState } from 'react';
import { IoMdHome } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoSettings } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

const SideBar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button
                className="sm:min-[768px]:hidden fixed top-4 left-4 text-3xl"
                onClick={toggleSidebar}
            >
                <GiHamburgerMenu />
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-4 space-y-4 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0  lg:flex lg:flex-col lg:w-64`}>
                <button className="sm:hidden text-2xl fixed top-3 right-3" onClick={toggleSidebar}>
                    ✖
                </button>

                <div className="space-y-6 text-xl">
                    <div className="flex items-center space-x-4 md:justify-center lg:justify-start">
                        <IoMdHome />
                        <span className="sm:hidden  lg:block ">Home</span>
                    </div>
                    <div className="flex items-center space-x-4 md:justify-center lg:justify-start">
                        <FaSearch />
                        <span className="sm:hidden  lg:block">Search</span>
                    </div>
                    <div className="flex items-center space-x-4 md:justify-center lg:justify-start">
                        <AiFillMessage />
                        <span className="sm:hidden  lg:block">Messages</span>
                    </div>
                    <div className="flex items-center space-x-4 md:justify-center lg:justify-start">
                        <IoNotifications />
                        <span className="sm:hidden  lg:block">Notifications</span>
                    </div>
                    <div className="flex items-center space-x-4 md:justify-center lg:justify-start">
                        <CgProfile />
                        <span className="sm:hidden  lg:block">Profile</span>
                    </div>
                    <div className="flex items-center space-x-4 md:justify-center lg:justify-start">
                        <IoSettings />
                        <span className="sm:hidden  lg:block">Settings</span>
                    </div>
                    <div className="flex items-center space-x-4 md:justify-center lg:justify-start">
                        <IoLogOut />
                        <span className="sm:hidden  lg:block">Logout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
