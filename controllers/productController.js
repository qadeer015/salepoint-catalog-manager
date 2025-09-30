const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.render("products/index", { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const products = await Product.getUserProducts(req.user.userId);
    res.render("products/index", { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.showProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.render("products/show", { product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.editProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const vendors = await Vendor.findAll();
    res.render("products/edit", { product, vendors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name, purchase_price, sale_price, quantity, batch, vendor_id } = req.body;
  try {
    const product = await Product.create(name, purchase_price, sale_price, quantity, batch, vendor_id, req.user.userId);
    console.log(product);
    res.status(201).redirect("/products");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.update(id, req.body);
    res.redirect("/products");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.delete(id);
    res.redirect("/products");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};