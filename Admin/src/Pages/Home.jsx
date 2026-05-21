import React, { useState } from "react";
import Navbar from "../Compontent/Navbar";
import Sidebar from "../Compontent/Sidebar";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full">

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="pt-[70px] p-6">
          <h1 className="text-3xl font-semibold">Home Page</h1>
        </div>
      </div>

    </div>
  );
}

export default Home;
