const nodemailer = require("nodemailer");

const sendInvoiceMail = async (userEmail, pdfBuffer, orderId) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vivekchavda6060@gmail.com",
      pass: "fjjp kely oldt cuwk",
    },
  });

  await transporter.sendMail({
    from: `"ShopXpress" <vivekchavda6060@gmail.com>`,
    to: userEmail,
    subject: `Invoice for Order #${orderId}`,
    text: "Thank you for shopping with us. Please find your invoice attached.",
    attachments: [
      {
        filename: `invoice_${orderId}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
};

module.exports = sendInvoiceMail;
