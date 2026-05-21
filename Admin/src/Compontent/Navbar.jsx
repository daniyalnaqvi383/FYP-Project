import axios from 'axios';
import React, { useContext } from 'react';
import { AdminDataContext } from '../Context/AdminContext';
import { AuthDataContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu } from "lucide-react";

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
        <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between fixed top-0 left-0 z-40">

            {/* Mobile Sidebar Toggle */}
            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu size={28} />
            </button>

            <div className="flex items-center gap-3">
                <img 
                    src="/logo.png"
                    alt="Logo"
                    className="w-10 h-10 object-cover rounded-full"
                />
                <h1 className="text-xl font-semibold text-gray-700">Admin Panel</h1>
            </div>

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
