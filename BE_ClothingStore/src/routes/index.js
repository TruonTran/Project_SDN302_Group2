const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
// const statisticsRoutes = require("./statisticsRoutes");
const profileRoutes = require("./profileRoutes");
const orderManagementRoutes = require("./orderManagementRoutes");


const route = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/carts", cartRoutes);
  app.use("/api/orders", orderRoutes);
  // app.use("/api/statistics", statisticsRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/orders", orderManagementRoutes);

};

module.exports = route;
