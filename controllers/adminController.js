const User = require("../models/User");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const Customer = require("../models/Customer");
const db = require("../config/db");
const {formatDateLabel} = require("../utils/format");


exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Run queries in parallel
    const [
      [userRows],
      [countRows],
      [monthRows]
    ] = await Promise.all([
      db.execute(`SELECT id, name, created_at FROM users WHERE id = ?`, [userId]),

      db.execute(`
        SELECT 
          (SELECT COUNT(*) FROM users) AS total_users
      `),

      db.execute(`
        SELECT 
          SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
                    AND YEAR(created_at) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) AS users_current,
          SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
                    AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) THEN 1 ELSE 0 END) AS users_last
        FROM users
      `)
    ]);

    const users = userRows.map(p => ({
      ...p,
      readable_date: formatDateLabel(p.created_at)
    }));

    const counts = countRows[0];       // { total_users, total_products, total_customers, total_vendors }
    const monthCounts = monthRows[0];  // { users_current, users_last }

    // Helper: growth calculation
    function calcGrowth(current, last) {
      if (last > 0) return Math.abs(((current - last) / last) * 100);
      if (current > 0) return 100;
      return 0;
    }

    // Growth for each type
    const growth = {
      users: calcGrowth(monthCounts.users_current, monthCounts.users_last),
    };

    // Final response
    const response = {
      users,
      totals: counts,
      growth
    };

    res.render("admin/dashboard", response);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render("admin/users", { users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
};

exports.showUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        const products = await Product.getUserProducts(user.id);
        const vendors = await Vendor.getByUserId(user.id);
        const customers = await Customer.getByUserId(user.id);
        res.render("admin/userProfile", { user, products, vendors, customers });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user");
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.render("admin/products", { products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products");
    }
};

exports.importData = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const products = await Product.getUserProducts(user.id);
    const vendors = await Vendor.getByUserId(user.id);
    const customers = await Customer.getByUserId(user.id);
    res.json({ user, products, vendors, customers });
};

exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findAll();
        res.render("admin/vendors", { vendors });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).send("Error fetching vendors");
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.render("admin/customers", { customers });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).send("Error fetching customers");
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.delete(id);
        res.redirect("/admin/users");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
};
