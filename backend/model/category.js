const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    cateName: {
      type: String,
      required: true,
    },
    cateImg: {
      type: String,
    },
  },
  { timestamps : true }
);

module.exports = mongoose.model("Category", categorySchema);

