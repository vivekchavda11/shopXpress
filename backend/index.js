require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = 3000;

mongoose
  .connect("mongodb+srv://vdchavda6060:vivek123@cluster0.pq47xgl.mongodb.net/")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("Hello Vivek!"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/productRoutes"));
app.use("/api", require("./routes/categoryRoutes"));
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/dashboardRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api", require("./routes/contactRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/invoice", require("./routes/invoice"));

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
