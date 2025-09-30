const Vendor = require("../models/Vendor");

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.getByUserId(req.user.userId);
    res.render("vendors/index", { vendors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.showVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findById(id);
    res.render("vendors/show", { vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findById(id);
    res.render("vendors/edit", { vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addVendor = async (req, res) => {
  const { name, phone, address, email } = req.body;
  try {
    await Vendor.create(name, phone, address, email, req.user.userId);
    res.status(201).redirect("/vendors");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVendor = async (req, res) => {
  const { id } = req.params;
  try {
    await Vendor.update(id, req.body);
    res.redirect("/vendors");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVendor = async (req, res) => {
  const { id } = req.params;
  try {
    await Vendor.delete(id);
    res.redirect("/vendors");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
