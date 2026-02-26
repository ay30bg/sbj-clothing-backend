const axios = require("axios");
const Order = require("../models/Order");

exports.verifyPaystackPayment = async (req, res) => {
  try {
    const { reference, orderData } = req.body;

    if (!reference) {
      return res.status(400).json({ message: "No reference provided" });
    }

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = response.data.data;

    if (paystackData.status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Save order to DB
    const newOrder = await Order.create({
      ...orderData,
      paymentRef: reference,
      paymentStatus: "paid",
    });

    res.status(200).json({
      message: "Payment verified & order saved",
      order: newOrder,
    });

  } catch (error) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
