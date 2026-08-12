import * as XLSX from "xlsx";
import type { Enquiry } from "./types";

export function formatEnquiryDate(
  value: string | Date | null | undefined
): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const ENQUIRY_TYPE_LABELS: Record<string, string> = {
  course: "Course Enquiry",
  course_enquiry: "Course Enquiry",
  "Course Enquiry": "Course Enquiry",
  general: "Normal Enquiry",
  "Normal Enquiry": "Normal Enquiry",
};

export function buildEnquiriesWorksheet(enquiries: Enquiry[]) {
  const exportData = enquiries.map((enquiry) => ({
    Name: enquiry.name,
    Email: enquiry.email,
    Phone: enquiry.phone || "N/A",
    "Course/Subject": enquiry.course || "N/A",
    Type: ENQUIRY_TYPE_LABELS[enquiry.type] ?? enquiry.type,
    Message: enquiry.message,
    Date: formatEnquiryDate(enquiry.date),
    Status: enquiry.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet["!cols"] = [
    { wch: 24 },
    { wch: 30 },
    { wch: 18 },
    { wch: 34 },
    { wch: 18 },
    { wch: 60 },
    { wch: 22 },
    { wch: 12 },
  ];
  return worksheet;
}

export function exportEnquiriesToExcel(enquiries: Enquiry[]) {
  if (enquiries.length === 0) return;
  const worksheet = buildEnquiriesWorksheet(enquiries);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
  const today = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `enquiries_${today}.xlsx`);
}
