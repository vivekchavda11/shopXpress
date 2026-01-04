const router = require("express").Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/categoryController");

router.post("/add/category", upload.single("cateImg"), controller.addCategory);
router.get("/get/categories", controller.getCategories);
router.get("/get/category/:id", controller.getCategoryById);
router.put("/update/category/:id", upload.single("cateImg"), controller.updateCategory);
router.delete("/delete/category/:id", controller.deleteCategory);

module.exports = router;
