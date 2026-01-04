const router = require("express").Router();
const orderController = require("../controllers/orderController");

// USER
router.post("/place", orderController.placeOrder);
router.get("/user/:userId", orderController.getUserOrders);
router.put("/cancel/:orderId", orderController.cancelOrderByUser); // NEW

// ADMIN
router.get("/admin", orderController.getAllOrders);
router.put("/admin/:orderId/status", orderController.updateOrderStatus);
router.delete("/admin/:orderId", orderController.deleteOrder);

module.exports = router;
