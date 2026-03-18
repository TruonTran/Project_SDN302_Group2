const express = require("express");
const connectDB = require("./config/db/connectDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const route = require("./routes");
require("dotenv").config();
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// ================= SWAGGER =================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================= STATIC FILE =================
app.use("/uploads/avatars", express.static(path.join(__dirname, "uploads/avatars")));
app.use("/uploads/products", express.static(path.join(__dirname, "uploads/products")));

// ================= ROUTES =================
route(app);

// ================= START SERVER =================
app.listen(PORT, async () => {
  try {
    await connectDB(DATABASE_URL);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Server failed to start:", error);
  }
});