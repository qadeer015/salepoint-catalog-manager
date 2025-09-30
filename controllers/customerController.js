const Customer = require("../models/Customer");

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.getByUserId(req.user.userId);
    res.render("customers/index", { customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.showCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    res.render("customers/show", { customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    res.render("customers/edit", { customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCustomer = async (req, res) => {
  const { name, phone, cnic_number, address, email } = req.body;
  try {
    await Customer.create(name, phone, cnic_number, address, email, req.user.userId);
    res.status(201).redirect("/customers");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.update(id, req.body);
    res.redirect("/customers");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.delete(id);
    res.redirect("/customers");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
