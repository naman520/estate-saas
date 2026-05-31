import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCurrentCompany } from "@/lib/current-company";

type ReceiptPdfRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: ReceiptPdfRouteProps) {
  const { id } = await params;

  const company = await getCurrentCompany();

  const receipt = await prisma.receipt.findFirst({
    where: {
      id,
      companyId: company.id,
    },
    include: {
      project: true,
      company: true,
    },
  });

  /*   const receipt = await prisma.receipt.findUnique({
    where: {
      id,
    },
    include: {
      project: true,
      company: true,
    },
  }); */

  if (!receipt) {
    return NextResponse.json(
      {
        error: "Receipt not found",
      },
      {
        status: 404,
      },
    );
  }

  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0.05, 0.05, 0.05);
  const gray = rgb(0.35, 0.35, 0.35);
  const lightGray = rgb(0.94, 0.94, 0.94);
  const dark = rgb(0.08, 0.08, 0.08);

  const margin = 48;
  let y = height - margin;

  function drawText(
    text: string,
    x: number,
    yPos: number,
    options?: {
      size?: number;
      bold?: boolean;
      color?: ReturnType<typeof rgb>;
    },
  ) {
    page.drawText(text, {
      x,
      y: yPos,
      size: options?.size || 11,
      font: options?.bold ? boldFont : font,
      color: options?.color || black,
    });
  }

  function drawLabelValue(
    label: string,
    value: string,
    x: number,
    yPos: number,
  ) {
    drawText(label, x, yPos, {
      size: 9,
      bold: true,
      color: gray,
    });

    drawText(value || "-", x, yPos - 16, {
      size: 11,
      bold: true,
      color: black,
    });
  }

  function drawLine(yPos: number) {
    page.drawLine({
      start: {
        x: margin,
        y: yPos,
      },
      end: {
        x: width - margin,
        y: yPos,
      },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });
  }

  // Header background
  page.drawRectangle({
    x: 0,
    y: height - 130,
    width,
    height: 130,
    color: dark,
  });

  drawText(receipt.company.name || "EstateFlow", margin, height - 62, {
    size: 24,
    bold: true,
    color: rgb(1, 1, 1),
  });

  drawText("Payment Receipt", margin, height - 92, {
    size: 13,
    color: rgb(0.85, 0.85, 0.85),
  });

  drawText(receipt.receiptNumber, width - 190, height - 62, {
    size: 16,
    bold: true,
    color: rgb(1, 1, 1),
  });

  drawText(formatDate(receipt.createdAt), width - 190, height - 88, {
    size: 11,
    color: rgb(0.85, 0.85, 0.85),
  });

  y = height - 175;

  // Amount box
  page.drawRectangle({
    x: margin,
    y: y - 70,
    width: width - margin * 2,
    height: 80,
    color: lightGray,
    borderColor: rgb(0.82, 0.82, 0.82),
    borderWidth: 1,
  });

  drawText("Amount Received", margin + 20, y - 15, {
    size: 11,
    bold: true,
    color: gray,
  });

  drawText(
    `INR ${receipt.amount.toLocaleString("en-IN")}`,
    margin + 20,
    y - 50,
    {
      size: 28,
      bold: true,
      color: black,
    },
  );

  y -= 125;

  drawText("Customer Details", margin, y, {
    size: 15,
    bold: true,
  });

  y -= 28;

  drawLabelValue("Customer Name", receipt.customerName, margin, y);
  drawLabelValue("Phone", receipt.phone || "-", width / 2, y);

  y -= 58;

  drawText("Project Details", margin, y, {
    size: 15,
    bold: true,
  });

  y -= 28;

  drawLabelValue("Project", receipt.project?.name || "No project", margin, y);
  drawLabelValue("Unit / Plot", receipt.unitDetails || "-", width / 2, y);

  y -= 58;

  drawText("Payment Details", margin, y, {
    size: 15,
    bold: true,
  });

  y -= 28;

  drawLabelValue(
    "Payment Mode",
    receipt.paymentMode.replaceAll("_", " "),
    margin,
    y,
  );

  drawLabelValue("Transaction ID", receipt.transactionId || "-", width / 2, y);

  y -= 64;

  if (receipt.notes) {
    drawText("Notes", margin, y, {
      size: 15,
      bold: true,
    });

    y -= 25;

    page.drawRectangle({
      x: margin,
      y: y - 55,
      width: width - margin * 2,
      height: 70,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: rgb(0.86, 0.86, 0.86),
      borderWidth: 1,
    });

    drawText(receipt.notes, margin + 15, y - 15, {
      size: 10,
      color: gray,
    });

    y -= 95;
  }

  drawLine(120);

  drawText("Authorized Signature", width - 210, 92, {
    size: 11,
    bold: true,
    color: black,
  });

  page.drawLine({
    start: {
      x: width - 220,
      y: 115,
    },
    end: {
      x: width - margin,
      y: 115,
    },
    thickness: 1,
    color: rgb(0.6, 0.6, 0.6),
  });

  drawText(
    receipt.company.receiptFooter ||
      "This is a computer-generated receipt. Please verify payment details before final confirmation.",
    margin,
    70,
    {
      size: 8,
      color: gray,
    },
  );

  if (receipt.company.phone || receipt.company.email) {
    drawText(
      `${receipt.company.phone || ""}${
        receipt.company.phone && receipt.company.email ? " | " : ""
      }${receipt.company.email || ""}`,
      margin,
      52,
      {
        size: 8,
        color: gray,
      },
    );
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${receipt.receiptNumber}.pdf"`,
    },
  });
}
