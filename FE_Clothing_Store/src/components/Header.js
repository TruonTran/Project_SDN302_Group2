import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Form, Button, Dropdown } from "react-bootstrap";
import { URL_IMG } from "../utils/constant";
import { logout } from "../api/authApi";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await logout(navigate);
    } catch (error) {
      toast.error(error.message || "Logout failed:");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/our-store?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header
      className="py-3 fixed-top"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        borderBottom: "1px solid #eee",
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">

          {/* LOGO */}
          <NavLink
            to="/"
            className="nav-link"
            style={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#1e3a8a",
              letterSpacing: "1px",
            }}
          >
            High Clothing
          </NavLink>

          {/* NAV MENU */}
          <nav
            className="d-flex justify-content-between align-items-center px-4 py-2 rounded-pill"
            style={{
              width: 500,
              backgroundColor: "#f1f5f9",
            }}
          >
            {["/", "/our-store", "/about", "/contact"].map((path, index) => {
              const names = ["Home", "Our Store", "About", "Contact"];
              return (
                <NavLink
                  key={index}
                  to={path}
                  end={path === "/"}
                  className="nav-link px-3 rounded-pill"
                  style={({ isActive }) => ({
                    color: isActive ? "#ffffff" : "#1e293b",
                    backgroundColor: isActive ? "#2563eb" : "transparent",
                    fontWeight: "500",
                    transition: "0.3s",
                  })}
                >
                  {names[index]}
                </NavLink>
              );
            })}
          </nav>

          {/* SEARCH */}
          <Form onSubmit={handleSearch} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search product"
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: "20px",
                border: "1px solid #cbd5e1",
                padding: "6px 15px",
              }}
            />
            <Button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                border: "none",
                borderRadius: "50%",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaSearch />
            </Button>
          </Form>

          {/* CART + USER */}
          <div className="d-flex align-items-center gap-3">

            <NavLink to="/cart" style={{ color: "#1e293b" }}>
              <FaShoppingCart size={22} />
            </NavLink>

            {user ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-basic"
                  style={{ padding: 0 }}
                >
                  <img
                    src={
                      user.avatar
                        ? `${URL_IMG}${user.avatar}`
                        : "https://cdn-icons-png.flaticon.com/512/219/219988.png"
                    }
                    alt="User Avatar"
                    className="rounded-circle"
                    style={{
                      width: "35px",
                      height: "35px",
                      border: "2px solid #2563eb",
                    }}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item as={NavLink} to="/profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/tracking-order">
                    Tracking Order
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <NavLink to="/login" style={{ color: "#1e293b" }}>
                <FaUserCircle size={26} />
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;