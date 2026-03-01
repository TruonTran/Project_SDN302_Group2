import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { URL_IMG } from "../../utils/constant";
import {
  getUserById,
  updateUser,
  changePassword,
  updateStatusUser,
} from "../../api/userApi";
import { logout } from "../../api/authApi";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("profile");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [profileData, setProfileData] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
    gender: user.gender || "",
    address: user.address || "",
    avatar: user.avatar || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user?._id) {
      toast.error("Please log in to view your profile.");
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userData = await getUserById(user._id);
      setProfileData({
        fullName: userData.fullName,
        phone: userData.phone || "",
        gender: userData.gender || "",
        address: userData.address || "",
        avatar: userData.avatar || "",
      });
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profileData.fullName || profileData.fullName.trim() === "") {
        toast.error("Full name cannot be empty.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("phone", profileData.phone || "");
      formData.append("gender", profileData.gender || "");
      formData.append("address", profileData.address || "");

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const updatedUser = await updateUser(user._id, formData);
      setProfileData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
      setSelectedFile(null);
      setViewMode("profile");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        userId: user._id
      });
      toast.success("Password updated successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setViewMode("profile");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateStatusUser(user._id, {
        status: "inactive",
        password: passwordData.confirmPassword,
      });
      toast.success("Your account has been blocked successfully!");
      await logout(navigate);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    setProfileData({
      fullName: currentUser.fullName || "",
      phone: currentUser.phone || "",
      gender: currentUser.gender || "",
      address: currentUser.address || "",
      avatar: currentUser.avatar || "",
    });
    setSelectedFile(null);
    setViewMode("profile");
  };

  if (loading) {
    return (
      <Container className="mt-4" style={{ minHeight: 500 }}>
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="mb-4" style={{ minHeight: 500 }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center p-4">
            <Card.Body>
              <Row className="align-items-center">
                {viewMode === "profile" && (
                  <>
                    <Col xs={4}>
                      <img
                        src={`${URL_IMG}${profileData.avatar}`}
                        alt="Profile Avatar"
                        className="rounded-circle mb-3"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                    <Col xs={8} className="text-start">
                      <p>
                        <strong>Full Name:</strong> {profileData.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {profileData.phone || "N/A"}
                      </p>
                      <p>
                        <strong>Gender:</strong> {profileData.gender || "N/A"}
                      </p>
                      <p>
                        <strong>Address:</strong> {profileData.address || "N/A"}
                      </p>
                      <Button
                        variant="primary"
                        className="w-100 mb-2"
                        onClick={() => setViewMode("updateProfile")}
                        disabled={loading}
                      >
                        Update Profile
                      </Button>
                      <Button
                        variant="warning"
                        className="w-100 mb-2"
                        onClick={() => setViewMode("changePassword")}
                        disabled={loading}
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="danger"
                        className="w-100"
                        onClick={() => setViewMode("blockaccount")}
                        disabled={loading}
                      >
                        Block My Account
                      </Button>
                    </Col>
                  </>
                )}
              </Row>

              {/* Form cập nhật thông tin cá nhân */}
              {viewMode === "updateProfile" && (
                <>
                  <h4>Update Profile</h4>
                  <img
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : `${URL_IMG}${profileData.avatar}`
                    }
                    alt="Profile Avatar"
                    className="rounded-circle mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <Form onSubmit={handleUpdateProfile}>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>Avatar</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 mb-2"
                      disabled={loading}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={handleCancelUpdate} // Gọi hàm reset khi nhấn Cancel
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Form>
                </>
              )}

              {/* Form thay đổi mật khẩu */}
              {viewMode === "changePassword" && (
                <>
                  <h4>Change Password</h4>
                  <img
                    src={`${URL_IMG}${profileData.avatar}`}
                    alt="Profile Avatar"
                    className="rounded-circle mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="danger"
                      className="w-100 mb-2"
                      disabled={loading}
                    >
                      Update Password
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={() => setViewMode("profile")}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Form>
                </>
              )}

              {/* Form khóa tài khoản */}
              {viewMode === "blockaccount" && (
                <>
                  <h4>Confirm Block Account</h4>
                  <img
                    src={`${URL_IMG}${profileData.avatar}`}
                    alt="Profile Avatar"
                    className="rounded-circle mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <Form onSubmit={handleBlockAccount}>
                    <Form.Group className="mb-3 text-start">
                      <Form.Label>Enter Password to Confirm</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="danger"
                      className="w-100 mb-2"
                      disabled={loading}
                    >
                      Confirm Block
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={() => setViewMode("profile")}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
