import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api/categoryApi";

const Sidebar = ({
  selectedGender,
  setSelectedGender,
  selectedCategory,
  setSelectedCategory,
  setMinPrice,
  setMaxPrice,
}) => {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  // ===== PREMIUM BUTTON STYLES =====
  const baseBtnStyle = {
    borderRadius: "25px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
    border: "none",
    padding: "8px 12px",
  };

  const activeStyle = {
    background: "linear-gradient(135deg, #141E30, #243B55)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  };

  const outlineStyle = {
    background: "#fff",
    color: "#243B55",
    border: "1px solid #243B55",
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const status = "active";
        const categoryData = await fetchCategories(status);
        setCategories(categoryData);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsFetching(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handlePriceChange = () => {
    setMinPrice(minInput);
    setMaxPrice(maxInput);
  };

  const handleHover = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div className="col-md-3">
      {/* ===== GENDER CARD ===== */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-center mb-3">Choose Gender</h5>
          <div className="d-flex gap-2">
            {["", "Men", "Women"].map((gender, index) => (
              <button
                key={index}
                style={{
                  ...baseBtnStyle,
                  ...(selectedGender === gender
                    ? activeStyle
                    : outlineStyle),
                }}
                className="w-100"
                onClick={() => setSelectedGender(gender)}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                {gender === "" ? "All" : gender}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CATEGORY CARD ===== */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-center mb-3">
            Shop By Categories
          </h5>

          {isFetching ? (
            <p>Loading categories...</p>
          ) : (
            <div className="row">
              <div className="col-6 mb-2">
                <button
                  style={{
                    ...baseBtnStyle,
                    ...(selectedCategory === ""
                      ? activeStyle
                      : outlineStyle),
                  }}
                  className="w-100"
                  onClick={() => setSelectedCategory("")}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                >
                  All
                </button>
              </div>

              {categories
                ?.filter((cat) => cat.status === "active")
                ?.map((category) => (
                  <div key={category._id} className="col-6 mb-2">
                    <button
                      style={{
                        ...baseBtnStyle,
                        ...(selectedCategory === category.name
                          ? activeStyle
                          : outlineStyle),
                      }}
                      className="w-100"
                      onClick={() =>
                        setSelectedCategory(category.name)
                      }
                      onMouseEnter={handleHover}
                      onMouseLeave={handleLeave}
                    >
                      {category.name}
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== PRICE FILTER CARD ===== */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Filter By</h5>
          <h6>Price</h6>

          <div className="d-flex gap-2 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="$ from"
              value={minInput}
              min={1}
              onChange={(e) => setMinInput(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="$ to"
              value={maxInput}
              min={1}
              onChange={(e) => setMaxInput(e.target.value)}
            />
          </div>

          <button
            style={{
              ...baseBtnStyle,
              background:
                "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
              color: "#fff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
            className="w-100"
            onClick={handlePriceChange}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(0,0,0,0.3)";
            }}
          >
            Apply Price Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;