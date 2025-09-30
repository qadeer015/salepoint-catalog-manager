const express = require("express");
const vendorsController = require("../controllers/vendorController");
const router = express.Router();

// Show form to add product
router.get("/new", (req, res) => {
    res.render("vendors/new");
});

router.get("/", vendorsController.getVendors);
router.post("/create", vendorsController.addVendor);
router.get("/:id", vendorsController.showVendor);
router.get("/:id/edit", vendorsController.editVendor);
router.put("/:id/update", vendorsController.updateVendor);
router.delete("/:id/delete", vendorsController.deleteVendor);

module.exports = router;