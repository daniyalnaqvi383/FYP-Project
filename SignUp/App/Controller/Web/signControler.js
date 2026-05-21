const modelSign = require("../../Models/sign.Model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await modelSign.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new modelSign({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await modelSign.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// geogle signup

// ✅ Google Signup/Login Controller
// ✅ Google Signup/Login Controller
const googleSignup = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await modelSign.findOne({ email }); // 👈 yaha galti thi, User ki jagah modelSign hoga

    if (!user) {
      user = await modelSign.create({
        name,
        email,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "defaultsecret", // fallback in case .env missing
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Google signup/login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Google Signup Error:", err); // full error print hoga
    res.status(500).json({ message: "Server error", error: err.message });
  }
};










// Controller/Web/signController.js

const logoutUser = async (req, res) => {
  try {
    // frontend se token header me bhejna hoga: "Authorization: Bearer <token>"
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // token ko database se delete karna
    await modelSign.findOneAndDelete({ token });

    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};






// current user

const getUser = async (req, res) => {
  try {
    const user = await modelSign.findById(req.user.id).select("-password"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};






module.exports = { signupUser, loginUser, googleSignup , getUser, logoutUser};
