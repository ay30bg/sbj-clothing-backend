const nodemailer = require("nodemailer");

const sendOrderEmail = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SELLER_EMAIL,
        pass: process.env.SELLER_EMAIL_PASS, // App password
      },
    });

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>₦${(item.price * item.qty).toLocaleString()}</td>
        </tr>
      `
      )
      .join("");

    const mailOptions = {
      from: `"SBJ Clothings" <${process.env.SELLER_EMAIL}>`,
      to: process.env.SELLER_EMAIL,
      subject: `🛍️ New Order - ${order.paymentRef}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Customer:</strong> ${order.shipping.fullName}</p>
        <p><strong>Phone:</strong> ${order.shipping.phone || "N/A"}</p>
        <p><strong>Address:</strong> ${order.shipping.address}, ${order.shipping.city}</p>

        <h3>Items</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
          ${itemsHtml}
        </table>

        <h3>Total: ₦${order.totals.orderTotal.toLocaleString()}</h3>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Seller email sent successfully");
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

module.exports = sendOrderEmail;
