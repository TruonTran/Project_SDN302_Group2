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

  return (
    <aside
      className="bg-dark text-white p-3 vh-100 position-fixed d-flex flex-column"
      style={{ width: "250px", left: 0, top: 0, bottom: 0 }}
    >
      <h4 className="text-center pb-3 border-bottom">Admin Panel</h4>
      <ul className="list-unstyled flex-grow-1">
        <li>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `nav-link d-flex align-items-center p-2 ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <FaTachometerAlt className="me-2" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center p-2 ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <FaBox className="me-2" /> Manage Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center p-2 ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <FaList className="me-2" /> Manage Categories
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/accounts"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center p-2 ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <FaUsers className="me-2" /> Manage Accounts
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center p-2 ${
                isActive ? "bg-primary text-white" : "text-light"
              }`
            }
          >
            <FaShoppingCart className="me-2" /> Manage Orders
          </NavLink>
        </li>
      </ul>

      {/* Nút Logout */}
      <button
        className="btn btn-danger w-100 d-flex align-items-center justify-content-center mt-3"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
