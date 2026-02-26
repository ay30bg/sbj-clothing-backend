// const axios = require("axios");
// const Order = require("../models/Order");

// exports.verifyPaystackPayment = async (req, res) => {
//   try {
//     const { reference, orderData } = req.body;

//     if (!reference) {
//       return res.status(400).json({ message: "No reference provided" });
//     }

//     // Verify with Paystack
//     const response = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         },
//       }
//     );

//     const paystackData = response.data.data;

//     if (paystackData.status !== "success") {
//       return res.status(400).json({ message: "Payment not successful" });
//     }

//     // Save order to DB
//     const newOrder = await Order.create({
//       ...orderData,
//       paymentRef: reference,
//       paymentStatus: "paid",
//     });

//     res.status(200).json({
//       message: "Payment verified & order saved",
//       order: newOrder,
//     });

//   } catch (error) {
//     console.error("Payment verification error:", error.message);
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

const axios = require("axios");
const Order = require("../models/Order");
const sendOrderEmail = require("../utils/sendOrderEmail"); // 👈 create this file

exports.verifyPaystackPayment = async (req, res) => {
  try {
    const { reference, orderData } = req.body;

    if (!reference || !orderData) {
      return res.status(400).json({ message: "Missing reference or order data" });
    }

    // 🔎 Check if order already exists (prevents duplicate save)
    const existingOrder = await Order.findOne({ paymentRef: reference });
    if (existingOrder) {
      return res.status(200).json({
        message: "Order already verified",
        order: existingOrder,
      });
    }

    // ✅ Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = response.data.data;

    if (!paystackData || paystackData.status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // 💰 Validate amount (Paystack amount is in kobo)
    const paidAmount = paystackData.amount / 100;
    if (paidAmount !== orderData.totals.orderTotal) {
      return res.status(400).json({
        message: "Amount mismatch. Payment invalid.",
      });
    }

    // 📝 Save order
    const newOrder = await Order.create({
      ...orderData,
      paymentRef: reference,
      paymentStatus: "paid",
      paidAt: new Date(),
    });

    // 📧 Send seller email (async but don't break flow if email fails)
    try {
      await sendOrderEmail(newOrder);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }

    return res.status(200).json({
      message: "Payment verified & order saved",
      order: newOrder,
    });

  } catch (error) {
    console.error("Payment verification error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
