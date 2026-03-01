/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaTag } from "react-icons/fa";
import CarouselShare from "../../components/CarouselShare";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../api/productApi";
import { URL_IMG } from "../../utils/constant";

const HomePage = () => {
  const [newestProducts, setNewestProducts] = useState([]);

  useEffect(() => {
    const loadNewestProducts = async () => {
      const products = await fetchProducts({
        limit: 8,
        status: "active",
      });
      setNewestProducts(products.products);
    };

    loadNewestProducts();
  }, []);
  const carousels = [
    {
      id: 1,
      url: "https://file.hstatic.net/1000178779/collection/sale-cuoi-nam-banner-web_d1854bed64e04561b21c6871e533ab4c.png",
    },
    {
      id: 2,
      url: "https://sigourney.vn/wp-content/uploads/2026/01/Banner-ngang-tet.jpg",
    },
    {
      id: 3,
      url: "https://file.hstatic.net/1000253775/article/343349024_9155559117849139_3035925125361529008_n_bbb71ca661ed4ffc8aab24131a2a0f9e.jpeg",
    },
  ];

  return (
    <Container>
      <CarouselShare carousels={carousels} />
      <Container className="py-4">
        <h1
          className="text-center mb-5"
          style={{
            fontWeight: 300,
            letterSpacing: "4px",
            fontSize: "28px",
          }}
        >
          NEW ARRIVALS
        </h1>        <Row>
          {newestProducts?.length > 0 ? (
            newestProducts?.map((product) => {
              const productImage =
                product?.images?.length > 0
                  ? `${URL_IMG}${product?.images[0]}`
                  : "/products/error.jpg";

              const finalPrice =
                product?.discountPrice !== 0
                  ? product?.discountPrice
                  : product?.price;

              const isDiscounted =
                product?.discountPrice !== 0 &&
                product?.discountPrice > 0 &&
                product?.discountPrice < product?.price;

              return (
                <Col sm={6} md={3} className="mb-5" key={product?._id}>
                  <Link
                    to={`/product-detail/${product?._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card
                      className="border-0"
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        transition: "all 0.35s ease",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 20px 40px rgba(0,0,0,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 25px rgba(0,0,0,0.05)";
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={productImage}
                          alt={product?.name}
                          style={{
                            height: 340,
                            objectFit: "cover",
                            transition: "transform 0.6s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        />

                        {isDiscounted && (
                          <div
                            style={{
                              position: "absolute",
                              top: 20,
                              left: 20,
                              backgroundColor: "#111",
                              color: "#fff",
                              padding: "6px 14px",
                              borderRadius: "30px",
                              fontSize: "11px",
                              letterSpacing: "1px",
                              fontWeight: 500,
                            }}
                          >
                            SALE
                          </div>
                        )}
                      </div>

                      <Card.Body style={{ padding: "22px" }}>
                        <Card.Title
                          style={{
                            fontSize: "15px",
                            fontWeight: 500,
                            marginBottom: "6px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {product.name}
                        </Card.Title>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#777",
                            marginBottom: "14px",
                          }}
                        >
                          {product.category?.name || "Category"}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: 600,
                              color: "#111",
                            }}
                          >
                            ${finalPrice.toLocaleString()}
                          </span>

                          {isDiscounted && (
                            <span
                              style={{
                                textDecoration: "line-through",
                                fontSize: "14px",
                                color: "#aaa",
                              }}
                            >
                              ${product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })
          ) : (
            <p className="text-center">No new products available.</p>
          )}
        </Row>

        <div className="d-flex justify-content-center mt-4">
          <Link to="/our-store" style={{ textDecoration: "none" }}>
            <Button
              style={{
                backgroundColor: "#111",
                border: "none",
                padding: "12px 40px",
                borderRadius: "40px",
                fontSize: "14px",
                letterSpacing: "2px",
                fontWeight: 500,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#333";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#111";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              VIEW ALL
            </Button>
          </Link>
        </div>
      </Container>
    </Container>
  );
};

export default HomePage;
