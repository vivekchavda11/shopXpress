const PDFDocument = require("pdfkit");

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${order._id}.pdf`
  );

  doc.pipe(res);

  /* ===== HEADER ===== */
  doc
    .fontSize(20)
    .text("INVOICE", { align: "center" })
    .moveDown();

  doc
    .fontSize(12)
    .text(`Order ID: ${order._id}`)
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`)
    .text(`Payment Method: ${order.paymentMethod}`)
    .moveDown();

  /* ===== ITEMS ===== */
  doc.fontSize(14).text("Order Items", { underline: true });
  doc.moveDown(0.5);

  order.items.forEach((item, index) => {
    doc
      .fontSize(11)
      .text(
        `${index + 1}. ${item.title} | Qty: ${item.qty} | ₹ ${item.price}`
      );
  });

  doc.moveDown();

  /* ===== TOTAL ===== */
  doc
    .fontSize(12)
    .text(`Subtotal: ₹ ${order.subtotal}`)
    .text(`Discount: ₹ ${order.discount || 0}`)
    .fontSize(14)
    .text(`Total Amount: ₹ ${order.totalAmount}`, {
      bold: true,
    });

  doc.end();
};

module.exports = generateInvoice;
