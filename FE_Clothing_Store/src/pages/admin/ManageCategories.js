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
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  createCategory,
  editCategory,
  deleteCategory,
} from "../../api/categoryApi";
import { toast } from "react-toastify";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    gender: [],
    status: "active",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ================= CHECK ADMIN =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.isAdmin) {
      toast.error("You do not have permission to access this page.");
      navigate("/");
      return;
    }
    fetchAllCategories();
  }, [navigate]);

  // ================= FETCH =================
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

  // ================= SEARCH =================
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

  // ================= SAVE =================
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

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      await fetchAllCategories();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN MODAL =================
  const handleOpenEditModal = (category = null) => {
    if (category) {
      setIsEdit(true);
      setCategoryId(category._id);
      setCurrentCategory({
        name: category.name,
        gender: category.gender || [],
        status: category.status || "active",
      });
    } else {
      setIsEdit(false);
      setCurrentCategory({
        name: "",
        gender: [],
        status: "active",
      });
    }
    setShowEditModal(true);
  };

  const handleGenderChange = (e) => {
    setCurrentCategory({
      ...currentCategory,
      gender: [e.target.value], // đúng schema MongoDB
    });
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-lg border-0 rounded-4 p-4">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold text-primary">
              📂 Category Management
            </h2>
          </Col>
          <Col className="text-end">
            <Button onClick={() => handleOpenEditModal()}>
              ➕ Add Category
            </Button>
          </Col>
        </Row>

        <InputGroup className="mb-4" style={{ maxWidth: "400px" }}>
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
            <thead>
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
                  <td>{category.gender?.join(", ")}</td>
                  <td>
                    <Badge
                      bg={
                        category.status === "active"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {category.status}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        handleOpenEditModal(category)
                      }
                    >
                      <FaEdit /> Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        handleDelete(category._id)
                      }
                    >
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* EDIT / ADD MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
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
                value={currentCategory.gender[0] || ""}
                onChange={handleGenderChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentCategory.status}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    status: e.target.value,
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit">
              {isEdit ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CategoryManagement;