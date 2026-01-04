const router = require("express").Router();
const { getCounts } = require("../controllers/dashboardController");

router.get("/dashboard/counts", getCounts);

module.exports = router;
