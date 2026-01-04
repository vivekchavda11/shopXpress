const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret_key = "6060";

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (await User.findOne({ username }))
      return res.status(409).json({ message: "Username already taken" });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user.", err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    if (!(user.role === "user" || user.role === "admin"))
      return res.status(403).json({ message: "Access Denied..!" });

    const token = jwt.sign({ id: user._id }, secret_key, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", err });
  }
};
