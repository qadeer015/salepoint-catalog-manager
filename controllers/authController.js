const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.register = async (req, res) => {
  const { company_name, name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create(company_name, name, email, hashedPassword, "customer");
    res.status(201).redirect("/auth/sign-in");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUser({ key: "email", value: email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid email or password" });
    const token = jwt.sign({ userId: user.id, user: user }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Set the token in a cookie
    res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    if(user.role == "admin"){
        return res.redirect("/admin/dashboard");
    }else{
        return res.redirect("/");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/sign-in");
};
