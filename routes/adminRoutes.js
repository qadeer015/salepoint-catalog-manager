const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.get("/dashboard", adminController.getDashboard);
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.showUser);
router.get("/users/:id/import-data", adminController.importData);
router.delete("/users/:id/delete", adminController.deleteUser);

// router.get("/products", aminController.getProducts);
// router.get("/vendors", aminController.getVendors);
// router.get("/customers", aminController.getCustomers);

module.exports = router;