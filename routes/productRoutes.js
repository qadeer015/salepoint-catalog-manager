const express = require("express");
const productsController = require("../controllers/productController");
const Vendor = require("../models/Vendor");
const router = express.Router();

// Show form to add product
router.get("/new", async (req, res) => {
    try {
        const vendors = await Vendor.getByUserId(req.user.userId);
        res.render("products/new", { vendors });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/", productsController.getUserProducts);
router.post("/create", productsController.addProduct);
router.get("/:id", productsController.showProduct);
router.get("/:id/edit", productsController.editProduct);
router.put("/:id/update", productsController.updateProduct);
router.delete("/:id/delete", productsController.deleteProduct);


module.exports = router;