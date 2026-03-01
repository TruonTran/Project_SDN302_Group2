import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/AdminSidebar";

const LayoutAdmin = () => {
  return (
    <div className="d-flex vh-100">
      <Sidebar />

      <main
        className="p-4 flex-grow-1"
        style={{ marginLeft: "250px", overflowX: "auto" }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutAdmin;
