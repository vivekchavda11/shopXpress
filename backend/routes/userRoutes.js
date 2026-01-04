const router = require("express").Router();
const controller = require("../controllers/userController");

router.get("/get/users", controller.getUsers);
router.get("/get/user/:id", controller.getUserById);
router.put("/update/user/:id", controller.updateUser);
router.delete("/delete/user/:id", controller.deleteUser);

module.exports = router;
