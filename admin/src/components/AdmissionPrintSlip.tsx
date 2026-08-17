import React, { useRef, useState } from "react";
import { Printer, X, ShieldCheck, Landmark, ClipboardList, Receipt, Signature, Award, Download, Loader2 } from "lucide-react";
import { Student, Course, Batch } from "../types.js";
import { useApp } from "../context/AppContext.js";
import { DMRushLogo } from "./DMRushLogo.js";
import { exportElementToA4Pdf } from "../lib/exportPdf.js";

interface AdmissionPrintSlipProps {
  student: Student;
  onClose: () => void;
}

export const AdmissionPrintSlip: React.FC<AdmissionPrintSlipProps> = ({ student, onClose }) => {
  const { courses, batches, settings } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const course = courses.find((c) => c.id === student.courseId);
  const batch = batches.find((b) => b.id === student.batchId);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      const cleanName = student.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      await exportElementToA4Pdf(printRef.current, `admission_slip_${cleanName || "student"}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF document:", error);
      alert("Failed to build download package. Please try using the Browser Print alternative.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* 1. ON-SCREEN MODAL PREVIEW OVERLAY (no-print) */}
      <div 
        id="admission-print-slip-modal"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-in fade-in duration-150"
      >
        <div className="bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header Action Bar */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold tracking-tight uppercase">Admission Confirmed & Verified</h3>
                <p className="text-[10px] text-slate-400 font-mono">Ledger Entry Serial: {student.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <button
                onClick={handleSavePDF}
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF File</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                disabled={isGenerating}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Browser Print</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Content Wrapper */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex justify-center">
            {/* The printable document visual preview on screen */}
            <div 
              ref={printRef}
              data-pdf-root
              className="printable-card-pdf bg-white w-[210mm] max-w-full min-h-[297mm] p-12 border border-slate-300 rounded-lg shadow-lg relative text-slate-800 font-sans"
            >
              <style>{`
                .printable-card-pdf, .printable-card-pdf * {
                  --color-slate-50: #f8fafc !important;
                  --color-slate-100: #f1f5f9 !important;
                  --color-slate-200: #e2e8f0 !important;
                  --color-slate-300: #cbd5e1 !important;
                  --color-slate-400: #94a3b8 !important;
                  --color-slate-500: #64748b !important;
                  --color-slate-600: #475569 !important;
                  --color-slate-700: #334155 !important;
                  --color-slate-800: #1e293b !important;
                  --color-slate-900: #0f172a !important;
                  --color-slate-950: #020617 !important;
                  --color-blue-50: #eff6ff !important;
                  --color-blue-100: #dbeafe !important;
                  --color-blue-200: #bfdbfe !important;
                  --color-blue-300: #93c5fd !important;
                  --color-blue-400: #60a5fa !important;
                  --color-blue-500: #3b82f6 !important;
                  --color-blue-600: #2563eb !important;
                  --color-blue-700: #1d4ed8 !important;
                  --color-blue-800: #1e40af !important;
                  --color-blue-900: #1e3a8a !important;
                  --color-emerald-50: #ecfdf5 !important;
                  --color-emerald-400: #34d399 !important;
                  --color-emerald-600: #059669 !important;
                  --color-emerald-700: #047857 !important;
                  --color-green-700: #15803d !important;
                  --color-red-600: #dc2626 !important;
                  --color-orange-500: #f97316 !important;
                  --color-gray-50: #f9fafb !important;
                  --color-gray-100: #f3f4f6 !important;
                  --color-gray-400: #9ca3af !important;
                  --color-gray-500: #6b7280 !important;
                  --color-gray-600: #4b5563 !important;
                  --color-gray-700: #374151 !important;
                }
              `}</style>
              
              {/* Outer double border design */}
              <div 
                className="absolute inset-4 border border-slate-200/50 pointer-events-none rounded" 
                style={{ borderColor: "rgba(226, 232, 240, 0.5)" }}
              />
              <div 
                className="absolute inset-5 border border-slate-200/80 pointer-events-none rounded" 
                style={{ borderColor: "rgba(226, 232, 240, 0.8)" }}
              />

              {/* WATERMARK BACKGROUND LOGO */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                <Landmark className="w-[300px] h-[300px]" />
              </div>

              {/* DOCUMENT BODY */}
              <div className="space-y-8 relative z-10">
                
                {/* 1. Header Information */}
                <div className="flex items-start justify-between border-b-2 border-slate-800 pb-5">
                  <div className="space-y-2">
                    <DMRushLogo height="h-9" textColor="black" showTagline={true} />
                    <p className="text-xs font-semibold text-blue-700 tracking-wider font-mono">
                      INSTITUTE OF COMPUTER SCIENCES & TECHNOLOGY
                    </p>
                    <div className="text-[10px] text-slate-500 font-medium max-w-sm space-y-0.5">
                      <p>{settings?.address || "Flat 101 Burj Al Ghauri Plaza, Faisal Colony Pattoki."}</p>
                      <p className="font-mono text-slate-700 font-bold">{settings?.phone || "+92 301 7786667"}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="bg-slate-900 text-white font-mono font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded">
                      ADMISSION SLIP
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                      Student ID: <span className="text-blue-600">{student.id}</span>
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono">
                      Issue Date: {student.admissionDate}
                    </p>
                  </div>
                </div>

                {/* 2. Personal Information Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                    <ClipboardList className="w-4 h-4 text-slate-700" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      I. Student Personal Information
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-8 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Full Name</span>
                      <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Father / Guardian Name</span>
                      <span className="font-semibold text-slate-800">{student.fatherName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">CNIC / Identification No</span>
                      <span className="font-mono text-slate-800">{student.cnic || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact Phone Number</span>
                      <span className="font-mono text-slate-800">{student.phone || "N/A"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Email Address</span>
                      <span className="font-mono text-slate-800">{student.email || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Program Enrollment Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                    <Award className="w-4 h-4 text-slate-700" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      II. Course Enrollment Details
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-y-3.5 gap-x-4 text-xs">
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Academic Program</span>
                      <span className="font-bold text-slate-900">{course?.name || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Program Duration</span>
                      <span className="font-semibold text-slate-800">{student.duration}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Class Batch</span>
                      <span className="font-mono text-slate-800 font-bold">{batch?.name || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Scheduled Daily Shift</span>
                      <span className="font-semibold text-slate-800 uppercase tracking-wide">{student.shift}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Commencement Date</span>
                      <span className="font-mono text-slate-800">{student.startDate || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Financial Structure / Invoice Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                    <Receipt className="w-4 h-4 text-slate-700" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      III. Financial Billing Statement
                    </h4>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                          <th className="p-3">Fee Item Description</th>
                          <th className="p-3 text-right">Amount (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="p-3">Standard Program Tuition Fee ({course?.name})</td>
                          <td className="p-3 text-right font-mono font-medium">{student.totalFee.toLocaleString()} PKR</td>
                        </tr>
                        {student.discount > 0 && (
                          <tr>
                            <td className="p-3 text-emerald-700">Scholarship / Merit Discount Applied</td>
                            <td className="p-3 text-right font-mono text-emerald-600">-{student.discount.toLocaleString()} PKR</td>
                          </tr>
                        )}
                        {student.paidAmount > 0 && (
                          <tr style={{ backgroundColor: "rgba(239, 246, 255, 0.2)" }}>
                            <td className="p-3 font-semibold text-blue-900">Admission Down-Payment (Received)</td>
                            <td className="p-3 text-right font-mono text-blue-700">-{student.paidAmount.toLocaleString()} PKR</td>
                          </tr>
                        )}
                        <tr className="font-bold border-t border-slate-200" style={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}>
                          <td className="p-3 text-slate-900">Net Receivable Ledger Balance Due</td>
                          <td className="p-3 text-right text-red-600 font-mono text-sm">
                            {student.pendingAmount.toLocaleString()} PKR
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-1 text-[10px] text-slate-500 font-medium">
                    <div>
                      {student.nextInstallmentDate && (
                        <p>Next Installment Due Date: <span className="font-mono font-bold text-slate-800">{student.nextInstallmentDate}</span></p>
                      )}
                    </div>
                    <div className="text-right">
                      <p>Fee Transaction Method: <span className="font-bold text-slate-800 uppercase">Cash Ledger Entry</span></p>
                    </div>
                  </div>
                </div>

                {/* 5. Rules & Guidelines Undertaking */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-[10px] text-slate-600">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider font-mono">Institute Rules & Student Undertaking</h5>
                  <p className="leading-relaxed">
                    1. Attendance must be maintained at a minimum of 80% throughout the course term to qualify for technical certificates.<br />
                    2. Paid admission downpayment and tuition fees are non-refundable and non-transferable under any circumstances.<br />
                    3. Students are strictly required to abide by code of conduct, respect administrative authorities and safeguard institute properties.
                  </p>
                </div>

                {/* 6. BOTTOM SIGNATURE BOX & STAMP */}
                <div className="pt-12 grid grid-cols-3 gap-8 text-xs">
                  {/* Student signature */}
                  <div className="flex flex-col justify-end space-y-6">
                    <div className="border-b border-slate-400 w-full h-8" />
                    <div className="text-center">
                      <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Student's Signature</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Applicant Sign-Off</p>
                    </div>
                  </div>

                  {/* Stamp Container Space for Manual Physical Stamp */}
                  <div className="flex items-center justify-center" />

                  {/* Institution signature */}
                  <div className="flex flex-col justify-end space-y-6">
                    <div className="border-b border-slate-400 w-full h-8" />
                    <div className="text-center">
                      <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Institute Authority</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Signature & Stamp</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PHYSICAL PRINT ONLY CONTAINER (visible only during media print) */}
      <div className="hidden print:block print-only-container absolute left-0 top-0 w-full bg-white text-black p-8 font-sans">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-5">
            <div className="space-y-2">
              <DMRushLogo height="h-9" textColor="black" showTagline={true} />
              <p className="text-xs font-mono font-bold tracking-widest text-blue-800">
                INSTITUTE OF COMPUTER SCIENCES & TECHNOLOGY
              </p>
              <div className="text-[10px] text-gray-600 space-y-0.5">
                <p>{settings?.address || "Flat 101 Burj Al Ghauri Plaza, Faisal Colony Pattoki."}</p>
                <p className="font-mono font-bold">{settings?.phone || "+92 301 7786667"}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="border border-black font-bold font-mono text-[9px] px-2 py-0.5 uppercase tracking-widest">
                ADMISSION RECEIPT
              </span>
              <p className="text-xs font-mono font-bold mt-2">Student ID: {student.id}</p>
              <p className="text-[9px] text-gray-500">Date: {student.admissionDate}</p>
            </div>
          </div>

          {/* I. Personal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
              I. Student Personal Profile
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-xs">
              <div><span className="text-[10px] text-gray-400 uppercase font-bold">Student Name:</span> <span className="font-bold">{student.name}</span></div>
              <div><span className="text-[10px] text-gray-400 uppercase font-bold">Guardian Name:</span> <span className="font-medium">{student.fatherName || "N/A"}</span></div>
              <div><span className="text-[10px] text-gray-400 uppercase font-bold">CNIC/B-Form:</span> <span className="font-mono">{student.cnic || "N/A"}</span></div>
              <div><span className="text-[10px] text-gray-400 uppercase font-bold">Phone Number:</span> <span className="font-mono">{student.phone || "N/A"}</span></div>
              <div className="col-span-2"><span className="text-[10px] text-gray-400 uppercase font-bold">Email Address:</span> <span className="font-mono">{student.email || "N/A"}</span></div>
            </div>
          </div>

          {/* II. Course */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
              II. Course Registration Details
            </h3>
            <div className="grid grid-cols-3 gap-x-4 text-xs">
              <div className="col-span-2"><span className="text-[10px] text-gray-400 uppercase font-bold">Academic Course:</span> <span className="font-bold">{course?.name}</span></div>
              <div><span className="text-[10px] text-gray-400 uppercase font-bold">Duration:</span> <span className="font-medium">{student.duration}</span></div>
              <div><span className="text-[10px] text-gray-400 uppercase font-bold">Batch:</span> <span className="font-bold font-mono">{batch?.name}</span></div>
              <div><span className="text-[10px] text-gray-400 uppercase font-bold">Class Shift:</span> <span className="font-medium uppercase">{student.shift}</span></div>
              <div><span className="text-[10px] text-gray-400 uppercase font-bold">Start Date:</span> <span className="font-mono">{student.startDate}</span></div>
            </div>
          </div>

          {/* III. Financial Billing Statement */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
              III. Financial Invoice Summary
            </h3>
            <table className="w-full text-xs text-left border border-black border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-black font-bold">
                  <th className="p-2 border-r border-black">Fee Item Description</th>
                  <th className="p-2 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                <tr>
                  <td className="p-2 border-r border-black font-semibold">Program Tuition Fees ({course?.name})</td>
                  <td className="p-2 text-right font-mono">{student.totalFee.toLocaleString()} PKR</td>
                </tr>
                {student.discount > 0 && (
                  <tr>
                    <td className="p-2 border-r border-black text-gray-600">Granted Merit Scholarship / Discount</td>
                    <td className="p-2 text-right font-mono text-green-700">-{student.discount.toLocaleString()} PKR</td>
                  </tr>
                )}
                {student.paidAmount > 0 && (
                  <tr>
                    <td className="p-2 border-r border-black font-bold">Down-Payment Amount Received</td>
                    <td className="p-2 text-right font-mono text-blue-700">-{student.paidAmount.toLocaleString()} PKR</td>
                  </tr>
                )}
                <tr className="bg-gray-50 font-bold border-t border-black">
                  <td className="p-2 border-r border-black text-sm">Remaining Receivable Balance Due</td>
                  <td className="p-2 text-right font-mono text-sm">
                    {student.pendingAmount.toLocaleString()} PKR
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rules */}
          <div className="border border-black p-3 text-[9px] text-gray-700">
            <p className="font-bold uppercase tracking-wider mb-1 font-mono">Student Undertaking & Agreement</p>
            <p className="leading-tight">
              1. Minimum 80% course attendance is mandatory for certification eligibility.<br />
              2. Fees once paid are non-refundable, non-transferable, and non-adjustable under any circumstances.<br />
              3. The applicant must respect institution code of conducts and policy standards at all times.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-16 grid grid-cols-2 gap-24 text-xs">
            <div className="text-center">
              <div className="border-b border-black w-full h-8 mb-2" />
              <p className="font-bold uppercase text-[10px]">Student's Signature</p>
              <p className="text-[9px] text-gray-400">Applicant signature</p>
            </div>
            <div className="text-center">
              <div className="border-b border-black w-full h-8 mb-2" />
              <p className="font-bold uppercase text-[10px]">Authorized Signature & Stamp</p>
              <p className="text-[9px] text-gray-400">Institute official stamp</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
