const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: String,
    shipping: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      phone: String,
    },
    items: Array,
    totals: {
      itemsTotal: Number,
      delivery: Number,
      orderTotal: Number,
    },
    paymentRef: String,
    paymentStatus: {
      type: String,
      default: "paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
