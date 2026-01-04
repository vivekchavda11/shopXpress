const router = require("express").Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/productController");

router.post("/add/product", upload.single("img"), controller.addProduct);
router.get("/get/products", controller.getProducts);
router.get("/get/product/:id", controller.getProductById);
router.put("/update/product/:id", upload.single("img"), controller.updateProduct);
router.delete("/delete/product/:id", controller.deleteProduct);

module.exports = router;
