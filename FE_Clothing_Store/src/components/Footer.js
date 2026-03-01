import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        marginTop: "60px",
      }}
    >
      <Container className="py-5">
        <Row className="text-center text-md-start">

          {/* BRAND */}
          <Col md={4} className="mb-4">
            <h5 style={{ fontWeight: "700", color: "#1e3a8a" }}>
               High Clothing
            </h5>
            <p style={{ color: "#475569", fontSize: "14px" }}>
              Elevate Your Style with modern fashion trends and timeless designs.
            </p>
          </Col>

          {/* CONTACT */}
          <Col md={4} className="mb-4">
            <h6 style={{ fontWeight: "600", marginBottom: "15px" }}>
              Contact
            </h6>
            <p style={{ fontSize: "14px", color: "#475569" }}>
              Email:{" "}
              <a
                href="mailto:support@unistyles.com"
                style={{ color: "#2563eb", textDecoration: "none" }}
              >
                support@unistyles.com
              </a>
            </p>
            <p style={{ fontSize: "14px", color: "#475569" }}>
              Phone: 08512345678
            </p>
            <p style={{ fontSize: "14px", color: "#475569" }}>
              21 Cai Khe Ward, Ninh Kieu District, Can Tho City
            </p>
          </Col>

          {/* SOCIAL */}
          <Col md={4} className="mb-4 text-center text-md-start">
            <h6 style={{ fontWeight: "600", marginBottom: "15px" }}>
              Follow Us
            </h6>

            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#2563eb",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <FaFacebookF />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#ec4899",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        <hr style={{ margin: "30px 0", color: "#e2e8f0" }} />

        <div className="text-center" style={{ fontSize: "13px", color: "#64748b" }}>
          © {new Date().getFullYear()} High Clothing. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;