const express = require("express");
const router = express.Router();
const { verifyPaystackPayment } = require("../controllers/orderController");

router.post("/verify-payment", verifyPaystackPayment);

module.exports = router;
