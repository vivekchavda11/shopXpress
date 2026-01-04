const Category = require("../model/category");

exports.addCategory = async (req, res) => {
  try {
    const { cateName } = req.body;

    const saved = await Category.create({
      cateName,
      cateImg: req.file ? req.file.filename : "",
    });

    res.json({ message: "Category added successfully", saved });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.getCategories = async (req, res) => {
  res.json(await Category.find().lean());
};

exports.getCategoryById = async (req, res) => {
  res.json(await Category.findById(req.params.id).lean());
};

exports.updateCategory = async (req, res) => {
  try {
    let updateData = { cateName: req.body.cateName };

    if (req.file) updateData.cateImg = req.file.filename;

    await Category.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ err });
  }
};
