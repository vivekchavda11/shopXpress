const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.get("/user/:userId", cartController.getUserCart);
router.put("/update", cartController.updateCartQty);
router.delete("/remove/:userId/:productId", cartController.removeItem);
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;
