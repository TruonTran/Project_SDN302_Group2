/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Badge,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit, FaSyncAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  createCategory,
  editCategory,
  updateCategoryStatus,
} from "../../api/categoryApi";
import { toast } from "react-toastify";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    gender: "",
  });
  const [currentStatus, setCurrentStatus] = useState("active");
  const [categoryId, setCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.isAdmin) {
      toast.error("You do not have permission to access this page.");
      navigate("/");
      return;
    }
    fetchAllCategories();
  }, [navigate]);

  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
      setFilteredCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((c) =>
          c.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, categories]);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await editCategory(categoryId, currentCategory);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(currentCategory);
        toast.success("Category created successfully!");
      }
      await fetchAllCategories();
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await updateCategoryStatus(categoryId, currentStatus);
      toast.success("Status updated successfully!");
      await fetchAllCategories();
      setShowStatusModal(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (category = null) => {
    if (category) {
      setIsEdit(true);
      setCategoryId(category._id);
      setCurrentCategory({
        name: category.name,
        gender: category.gender,
      });
    } else {
      setIsEdit(false);
      setCurrentCategory({ name: "", gender: "" });
    }
    setShowEditModal(true);
  };

  const handleOpenStatusModal = (category) => {
    setCategoryId(category._id);
    setCurrentStatus(category.status);
    setShowStatusModal(true);
  };

  return (
    <div

    >
      <Container>
        <Card className="shadow-lg border-0 rounded-4 p-4">
          <Row className="mb-4">
            <Col>
              <h2 className="fw-bold text-primary">
                📂 Category Management
              </h2>
            </Col>
            <Col className="text-end">
              <Button
                variant="primary"
                className="shadow-sm"
                onClick={() => handleOpenEditModal()}
              >
                ➕ Add Category
              </Button>
            </Col>
          </Row>

          <InputGroup className="mb-4 shadow-sm" style={{ maxWidth: "400px" }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td className="fw-semibold">{category.name}</td>
                    <td>{category.gender}</td>
                    <td>
                      <Badge
                        bg={
                          category.status === "active"
                            ? "success"
                            : "warning"
                        }
                      >
                        {category.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          handleOpenEditModal(category)
                        }
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() =>
                          handleOpenStatusModal(category)
                        }
                      >
                        <FaSyncAlt /> Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {isEdit ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={currentCategory.name}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={currentCategory.gender}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    gender: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary">
              {isEdit ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Status Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Select
              value={currentStatus}
              onChange={(e) =>
                setCurrentStatus(e.target.value)
              }
              className="mb-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>

            <Button
              variant="warning"
              onClick={handleUpdateStatus}
            >
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryManagement;