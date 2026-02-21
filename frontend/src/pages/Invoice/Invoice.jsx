import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Invoice.css";

const Invoice = () => {
  const location = useLocation();
  const order = location.state?.order;  

  // 🔥 NEW: Loading state
  const [loading, setLoading] = useState(false);

  if (!order) {
    return <div style={{ padding: 20 }}>No order data found.</div>;
  }

  const deliveryCharge = 40;
  const subTotal = order.amount - deliveryCharge;

  const downloadPDF = async () => {
    setLoading(true);

    // Small delay so user can see loading effect
    setTimeout(() => {
      const doc = new jsPDF();

      const dateObj = new Date(order.date);
      const formattedDate = dateObj.toLocaleDateString();
      const formattedTime = dateObj.toLocaleTimeString();

      // ================= HEADER =================
      doc.setFontSize(18);
      doc.text("INVOICE", 14, 20);

      doc.setFontSize(11);

      const labelX = 14;
      const colonX = 45;
      const valueX = 52;

      let y = 30;

      doc.text("Invoice No", labelX, y);
      doc.text(":", colonX, y);
      doc.text(String(order._id), valueX, y);

      y += 7;
      doc.text("Date", labelX, y);
      doc.text(":", colonX, y);
      doc.text(formattedDate, valueX, y);

      y += 7;
      doc.text("Time", labelX, y);
      doc.text(":", colonX, y);
      doc.text(formattedTime, valueX, y);

      // ================= CUSTOMER =================
      y += 14;
      doc.setFontSize(12);
      doc.text("Customer Details", labelX, y);

      y += 10;
      doc.setFontSize(11);

      doc.text("Name", labelX, y);
      doc.text(":", colonX, y);
      doc.text(
        `${order.address?.firstName || ""} ${order.address?.lastName || ""}`,
        valueX,
        y
      );

      y += 8;
      doc.text("Address", labelX, y);
      doc.text(":", colonX, y);

      const fullAddress = `${order.address?.address || ""}, ${
        order.address?.city || ""
      }`;

      const addressLines = doc.splitTextToSize(fullAddress, 130);

      doc.text(addressLines, valueX, y);
      y += addressLines.length * 6 + 3;

      doc.text("Phone", labelX, y);
      doc.text(":", colonX, y);
      doc.text(order.address?.phone || "", valueX, y);

      // ================= ITEMS TABLE =================
      y += 15;

      const tableData = order.items.map((item, index) => [
        index + 1,
        item.name,
        item.quantity,
        `${item.price} TK`,
        `${item.price * item.quantity} TK`,
      ]);

      autoTable(doc, {
        startY: y,
        head: [["#", "Item Name", "Qty", "Price", "Total"]],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 0, 0] },
      });

      const finalY = doc.lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: finalY,
        body: [
          ["Sub Total", `${subTotal} TK`],
          ["Delivery Charge", `${deliveryCharge} TK`],
          ["Grand Total", `${order.amount} TK`],
        ],
        theme: "grid",
        styles: { fontSize: 11 },
        columnStyles: {
          0: { halign: "left" },
          1: { halign: "right" },
        },
        tableWidth: 80,
        margin: { left: 115 },
      });

      doc.save(`Invoice-${order._id}.pdf`);

      setLoading(false);
    }, 600); // 600ms smooth loading effect
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2 className="hed">Invoice</h2>

      <button
        onClick={downloadPDF}
        className="dbutton"
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download PDF"}
      </button>
    </div>
  );
};

export default Invoice;
