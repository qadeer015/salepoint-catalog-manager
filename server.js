const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
require("dotenv").config();
const db = require("./config/db");
const {formatDateLabel} = require("./utils/format");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { bindUser, authenticate, isAdmin } = require("./middleware/authenticate");

const app = express();

const expressLayouts = require("express-ejs-layouts");

// Static files (css/js)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");


app.use(express.static(path.join(__dirname, "public")));
app.use(bindUser);

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.path = req.path;
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use(authenticate);
app.get("/", async (req, res) => {
  const userId = req.user.userId;
  const [
    [products],
    [customers],
    [vendors],
    [[counts]],
    [[monthCounts]]
  ] = await Promise.all([
    db.execute(`SELECT id, name, created_at FROM products WHERE user_id = ?`, [userId]),
    db.execute(`SELECT id, name, created_at FROM customers WHERE user_id = ?`, [userId]),
    db.execute(`SELECT id, name, created_at FROM vendors WHERE user_id = ?`, [userId]),
    db.execute(`
    SELECT 
      (SELECT COUNT(*) FROM products WHERE user_id = ?) AS total_products,
      (SELECT COUNT(*) FROM customers WHERE user_id = ?) AS total_customers,
      (SELECT COUNT(*) FROM vendors WHERE user_id = ?) AS total_vendors
  `, [userId, userId, userId]),
    db.execute(`
    SELECT 
      -- products
      SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
                AND YEAR(created_at) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) AS products_current,
      SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
                AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) THEN 1 ELSE 0 END) AS products_last,
      -- customers
      (SELECT COUNT(*) FROM customers 
         WHERE user_id = ? 
           AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
           AND YEAR(created_at) = YEAR(CURRENT_DATE())) AS customers_current,
      (SELECT COUNT(*) FROM customers 
         WHERE user_id = ? 
           AND MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
           AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)) AS customers_last,
      -- vendors
      (SELECT COUNT(*) FROM vendors 
         WHERE user_id = ? 
           AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
           AND YEAR(created_at) = YEAR(CURRENT_DATE())) AS vendors_current,
      (SELECT COUNT(*) FROM vendors 
         WHERE user_id = ? 
           AND MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
           AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)) AS vendors_last
    FROM products
    WHERE user_id = ?
  `, [userId, userId, userId, userId, userId])
  ]);

  // Format dates
  products.forEach(p => p.readable_date = formatDateLabel(p.created_at));
  customers.forEach(c => c.readable_date = formatDateLabel(c.created_at));
  vendors.forEach(v => v.readable_date = formatDateLabel(v.created_at));

  // Helper: growth calculation
  function calcGrowth(current, last) {
    if (last > 0) return Math.abs(((current - last) / last) * 100);
    if (current > 0) return 100;
    return 0;    
  }
  
  // Growth for each type
  const growth = {
    products: calcGrowth(monthCounts.products_current, monthCounts.products_last),
    customers: calcGrowth(monthCounts.customers_current, monthCounts.customers_last),
    vendors: calcGrowth(monthCounts.vendors_current, monthCounts.vendors_last)
  };
  // Final response
  const response = {
    products,
    customers,
    vendors,
    totals: counts,    // { total_products, total_customers, total_vendors }
    growth              // { products: xx%, customers: xx%, vendors: xx% }
  };
  res.render("index", response);
});
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/vendors", vendorRoutes);
app.use(isAdmin);
app.use("/admin",adminRoutes)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
} else {
  module.exports = app;
}