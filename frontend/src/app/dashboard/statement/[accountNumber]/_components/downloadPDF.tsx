import { TransactionType } from "@/app/types";
import jsPDF from "jspdf";

export const downloadPDF = (transactions: TransactionType[]) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let y = margin;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Transaction Report", margin, y);
  y += 10;

  // Date
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
  y += 10;

  // Table Headers
  doc.setFont("helvetica", "bold");
  doc.setFillColor(230, 230, 230); // light grey background
  doc.rect(margin, y, 170, 10, "F");
  doc.text("Reference", margin + 2, y + 7);
  doc.text("Amount (₮)", margin + 65, y + 7);
  doc.text("Balance (₮)", margin + 130, y + 7);
  y += 12;

  // Table Rows
  doc.setFont("helvetica", "normal");

  transactions.forEach((transaction, index) => {
    // Page break if needed
    if (y > pageHeight - 20) {
      doc.addPage();
      y = margin;
    }

    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245); // light row shading
      doc.rect(margin, y - 2, 170, 10, "F");
    }

    doc.text(`${transaction.amount}₮`, margin + 65, y + 5);
    doc.text(`${transaction.runningBalance}₮`, margin + 130, y + 5);
    doc.text(transaction.reference, margin + 2, y + 5);

    y += 10;
  });

  // Save PDF
  doc.save("transaction_report.pdf");
};
