const express = require("express");
const Order = require("../model/Order");
const User = require("../model/User");
const PDFDocument = require("pdfkit");
const sendInvoiceMail = require("../utils/sendInvoiceMail");

const router = express.Router();

router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const user = await User.findById(order.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      if (
        order.paymentStatus?.toLowerCase() === "paid" ||
        order.paymentMethod === "COD"
      ) {
        await sendInvoiceMail(user.email, pdfBuffer, order._id);
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice_${order._id}.pdf`
      );
      res.send(pdfBuffer);
    });

    /* ================= HEADER ================= */
    doc.font("Helvetica-Bold").fontSize(22).text("ShopXpress", { align: "center" });
    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(16).text("INVOICE", { align: "center" });
    doc.moveDown(0.5)  
    /* ================= MAIN OUTER BOX ================= */
    const boxX = 40;
    const boxY = doc.y;
    const boxWidth = 515;
    let currentY = boxY + 10;

    /* ================= BILLED TO + INVOICE DETAILS ================= */
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Billed To:", boxX + 10, currentY);
    doc.text("Invoice Details:", boxX + 280, currentY);

    doc.font("Helvetica").fontSize(10);
    doc.font("Helvetica-Bold").text("Name:", boxX + 10, currentY + 14, { continued: true });
    doc.font("Helvetica").text(` ${user.username || "Customer"}`);

    doc.font("Helvetica-Bold").text("Email:", boxX + 10, currentY + 28, { continued: true });
    doc.font("Helvetica").text(` ${user.email}`);


    doc.text(`Invoice No: INV-${order._id}`, boxX + 280, currentY + 14);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      boxX + 280,
      currentY + 28
    );
    doc.text(`Payment: ${order.paymentMethod}`, boxX + 280, currentY + 42);

    /* separator */
    currentY += 60;
    doc.moveTo(boxX, currentY).lineTo(boxX + boxWidth, currentY).stroke();

    /* ================= ITEMS TABLE ================= */
    const tableStartY = currentY + 8;
    let tableY = tableStartY;

    const colItem = boxX + 10;
    const colQty = boxX + 280;
    const colPrice = boxX + 340;
    const colTotal = boxX + 430;

    // Header text
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Item Description", colItem, tableY);
    doc.text("Qty", colQty, tableY);
    doc.text("Price", colPrice, tableY);
    doc.text("Total", colTotal, tableY);

    // Header underline
    tableY += 16;
    doc.moveTo(boxX, tableY).lineTo(boxX + boxWidth, tableY).stroke();

   
    const headerLineY = tableY;

    doc.font("Helvetica").fontSize(10);

    order.items.forEach((item) => {
      const lineTotal = item.qty * item.price;

      tableY += 10;
      doc.text(item.title, colItem, tableY, { width: 250 });
      doc.text(item.qty.toString(), colQty, tableY);
      doc.text(`Rs. ${item.price}`, colPrice, tableY);
      doc.text(`Rs. ${lineTotal}`, colTotal, tableY);

      tableY += 14;
      doc.moveTo(boxX, tableY).lineTo(boxX + boxWidth, tableY).stroke();
    });

    const tableEndY = tableY;

    
    doc
      .moveTo(colQty - 10, headerLineY)
      .lineTo(colQty - 10, tableEndY)
      .stroke();

    doc
      .moveTo(colPrice - 10, headerLineY)
      .lineTo(colPrice - 10, tableEndY)
      .stroke();

    doc
      .moveTo(colTotal - 10, headerLineY)
      .lineTo(colTotal - 10, tableEndY)
      .stroke();

    /* ================= TOTAL SECTION ================= */
    currentY = tableEndY + 14;

    doc.font("Helvetica").fontSize(10);
    doc.text("Subtotal", boxX + 300, currentY);
    doc.text(`Rs. ${order.subtotal}`, boxX + 430, currentY);

    currentY += 16;
    doc.text("Discount", boxX + 300, currentY);
    doc.text(`Rs. ${order.discount || 0}`, boxX + 430, currentY);

    currentY += 20;
    doc.font("Helvetica-Bold");
    doc.text("Grand Total", boxX + 300, currentY);
    doc.text(`Rs. ${order.totalAmount}`, boxX + 430, currentY);

    /* ================= OUTER BORDER ================= */
    const boxHeight = currentY - boxY + 20;
    doc.rect(boxX, boxY, boxWidth, boxHeight).stroke();

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invoice generation failed" });
  }
});

module.exports = router;
