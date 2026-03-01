import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaList,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../api/authApi";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(navigate);
    } catch (error) {
      toast.error(error.message || "Failed to logout");
    }
  };

  const linkStyle = ({ isActive }) =>
    `nav-link d-flex align-items-center p-2 mb-2 rounded-3 ${isActive
      ? "bg-white text-dark fw-bold shadow"
      : "text-white"
    }`;

  return (
    <aside
      className="text-white p-3 vh-100 position-fixed d-flex flex-column shadow-lg"
      style={{
        width: "250px",
        left: 0,
        top: 0,
        bottom: 0,
        background: "linear-gradient(180deg, #2b5876 0%, #4e4376 100%)",
      }}
    >
      <h4 className="text-center pb-3 border-bottom border-light">
        Admin Panel
      </h4>

      <ul className="list-unstyled flex-grow-1 mt-3">
        <li>
          <NavLink to="/admin" end className={linkStyle}>
            <FaTachometerAlt className="me-2" /> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/products" className={linkStyle}>
            <FaBox className="me-2" /> Manage Products
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/categories" className={linkStyle}>
            <FaList className="me-2" /> Manage Categories
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/accounts" className={linkStyle}>
            <FaUsers className="me-2" /> Manage Accounts
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/orders" className={linkStyle}>
            <FaShoppingCart className="me-2" /> Manage Orders
          </NavLink>
        </li>
      </ul>

      <button
        className="btn btn-light text-dark w-100 d-flex align-items-center justify-content-center mt-3 fw-bold"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;