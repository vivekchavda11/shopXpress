const Product = require("../model/Product");
const fs = require("fs");
const path = require("path");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, desc, cate, stock } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      desc,
      cate,
      stock,
      img: req.file ? "/uploads/" + req.file.filename : "",
    });

    res.json({ message: "Product Added Successfully", newProduct });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", err });
  }
};

exports.getProducts = async (req, res) => {
  try {
    res.json(await Product.find().lean());
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.getProductById = async (req, res) => {
  try {
    res.json(await Product.findById(req.params.id).lean());
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let updateData = req.body;

    if (req.file) {
      if (product.img) {
        const oldPath = path.join(__dirname, "..", product.img);
        fs.unlink(oldPath, () => {});
      }
      updateData.img = "/uploads/" + req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (product?.img) {
      const imagePath = path.join(__dirname, "..", product.img);
      fs.unlink(imagePath, () => {});
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ err });
  }
};
