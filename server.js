const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

const { bindUser, authenticate } = require("./middleware/authenticate");

const app = express();

const expressLayouts = require("express-ejs-layouts");

// Static files (css/js)
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(bindUser);

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.path = req.path;
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use(authenticate);
app.get("/", (req, res) => res.render("index"));
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/vendors", vendorRoutes);

// ✅ Run locally OR export for Vercel
if (require.main === module) {
  // Running directly (local)
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
} else {
  // Running on Vercel
  module.exports = app;
}