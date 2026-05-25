import axios from 'axios';
import React, { useContext } from 'react';
import { AdminDataContext } from '../Context/AdminContext';
import { AuthDataContext } from '../Context/AuthContext';
import { Links, useNavigate } from 'react-router-dom';
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"

function Navbar({ sidebarOpen, setSidebarOpen }) {

    const navigate = useNavigate();
    const { serverUrl } = useContext(AuthDataContext);
    const { getAdmin } = useContext(AdminDataContext);

    const logout = async () => {
        try {
            await axios.get(`${serverUrl}/api/admin/logout`, { withCredentials: true });
            getAdmin();
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <nav className="w-full bg-white shadow-md px-6 py-3 mb-1 flex items-center justify-between fixed top-0 left-0 z-40">

            {/* Mobile Sidebar Toggle */}
            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu size={28} />
            </button>

             <Link to="/" className="flex items-center h-full py-2">
  <img 
    src={logo} 
    alt="TryLo Logo" 
    className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105" 
  />
</Link>

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={logout}
            >
                Logout
            </button>

        </nav>
    );
}

export default Navbar;
