const express = require("express");
const customersController = require("../controllers/customerController");
const router = express.Router();

// Show form to add product
router.get("/new", (req, res) => {
  res.render("customers/new");
});
router.get("/", customersController.getCustomers);
router.post("/create", customersController.addCustomer);
router.get("/:id", customersController.showCustomer);
router.get("/:id/edit", customersController.editCustomer);
router.put("/:id/update", customersController.updateCustomer);
router.delete("/:id/delete", customersController.deleteCustomer);

module.exports = router;