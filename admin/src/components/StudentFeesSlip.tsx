import React, { useRef, useState } from "react";
import { Printer, X, ShieldCheck, Landmark, CreditCard, Receipt, Signature, Download, Loader2, CheckCircle, Calendar, Users, AlertCircle } from "lucide-react";
import { Student, Course, Batch } from "../types.js";
import { useApp } from "../context/AppContext.js";
import { DMRushLogo } from "./DMRushLogo.js";
import { exportElementToA4Pdf } from "../lib/exportPdf.js";

interface StudentFeesSlipProps {
  student: Student;
  onClose: () => void;
}

export const StudentFeesSlip: React.FC<StudentFeesSlipProps> = ({ student, onClose }) => {
  const { courses, batches, settings, payments } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const course = courses.find((c) => c.id === student.courseId);
  const batch = batches.find((b) => b.id === student.batchId);
  const studentPayments = payments.filter((p) => p.studentId === student.id);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      const cleanName = student.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      await exportElementToA4Pdf(printRef.current, `fee_slip_${cleanName || "student"}.pdf`);
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
        id="fee-print-slip-modal"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-in fade-in duration-150"
      >
        <div className="bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header Action Bar */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold tracking-tight uppercase">Student Fee Slip & Statement</h3>
                <p className="text-[10px] text-slate-400 font-mono">Ledger Entry Serial: {student.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <button
                onClick={handleSavePDF}
                disabled={isGenerating}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 cursor-pointer"
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
                    <p className="text-xs font-semibold text-emerald-700 tracking-wider font-mono">
                      INSTITUTE OF COMPUTER SCIENCES & TECHNOLOGY
                    </p>
                    <div className="text-[10px] text-slate-500 font-medium max-w-sm space-y-0.5">
                      <p>{settings?.address || "Flat 101 Burj Al Ghauri Plaza, Faisal Colony Pattoki."}</p>
                      <p className="font-mono text-slate-700 font-bold">{settings?.phone || "+92 301 7786667"}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="bg-emerald-700 text-white font-mono font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded">
                      OFFICIAL FEES SLIP
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                      Student ID: <span className="text-blue-600">{student.id}</span>
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono">
                      Issued: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* 2. Student Biographical Row */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs bg-slate-50 p-4 border border-slate-200 rounded-lg">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-slate-400 font-mono tracking-wider font-semibold">Student Name:</span>
                    <p className="font-bold text-slate-900 text-sm uppercase">{student.name}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-slate-400 font-mono tracking-wider font-semibold">Guardian / Father Name:</span>
                    <p className="font-semibold text-slate-800">{student.fatherName || "N/A"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-slate-400 font-mono tracking-wider font-semibold">Identification (CNIC):</span>
                    <p className="font-mono text-slate-800">{student.cnic || "N/A"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-slate-400 font-mono tracking-wider font-semibold">Contact (Phone):</span>
                    <p className="font-mono text-slate-800 font-bold">{student.phone || "N/A"}</p>
                  </div>
                </div>

                {/* 3. Academic Details Panel */}
                <div className="grid grid-cols-3 gap-4 text-xs pt-2">
                  <div className="p-3 border border-slate-100 rounded-lg space-y-1">
                    <span className="text-[8px] uppercase text-slate-400 font-mono font-bold">Enrolled Program</span>
                    <p className="font-bold text-slate-900 truncate">{course ? course.name : "N/A"}</p>
                  </div>
                  <div className="p-3 border border-slate-100 rounded-lg space-y-1">
                    <span className="text-[8px] uppercase text-slate-400 font-mono font-bold">Assigned Batch</span>
                    <p className="font-mono font-bold text-slate-900">{batch ? batch.name : "N/A"}</p>
                  </div>
                  <div className="p-3 border border-slate-100 rounded-lg space-y-1">
                    <span className="text-[8px] uppercase text-slate-400 font-mono font-bold">Shift & Timeline</span>
                    <p className="font-bold text-slate-900">{student.shift} ({student.duration})</p>
                  </div>
                </div>

                {/* 4. Financial accounts balance sheet */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    <span>Financial Ledger Statement</span>
                  </h4>
                  
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                          <th className="p-3">Fee Ledger Description</th>
                          <th className="p-3 text-right">Debit / Credit Amount (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr>
                          <td className="p-3 text-slate-700">Course Standard Tuition Fee</td>
                          <td className="p-3 text-right font-mono text-slate-800">{student.totalFee.toLocaleString()} PKR</td>
                        </tr>
                        {student.discount > 0 && (
                          <tr className="text-amber-700 bg-amber-50/10">
                            <td className="p-3">Scholarship/Adjustment Discount Applied</td>
                            <td className="p-3 text-right font-mono">-{student.discount.toLocaleString()} PKR</td>
                          </tr>
                        )}
                        {student.paidAmount > 0 && (
                          <tr style={{ backgroundColor: "rgba(239, 246, 255, 0.2)" }}>
                            <td className="p-3 font-semibold text-blue-900">Total Payments Logged (Received)</td>
                            <td className="p-3 text-right font-mono text-emerald-700">-{student.paidAmount.toLocaleString()} PKR</td>
                          </tr>
                        )}
                        <tr className="font-bold border-t border-slate-200" style={{ backgroundColor: "rgba(248, 250, 252, 0.5)" }}>
                          <td className="p-3 text-slate-900">Outstanding Balance Owed (Remaining)</td>
                          <td className="p-3 text-right text-red-600 font-mono text-sm">
                            {student.pendingAmount.toLocaleString()} PKR
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Payments list history table */}
                {studentPayments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Installment Transactions History</span>
                    </h4>
                    
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                            <th className="p-2.5">Receipt ID</th>
                            <th className="p-2.5">Payment Date & Time</th>
                            <th className="p-2.5">Payment Gateway</th>
                            <th className="p-2.5 text-right">Amount Paid</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {studentPayments.map((p) => (
                            <tr key={p.id}>
                              <td className="p-2.5 font-mono font-bold text-blue-600">{p.id}</td>
                              <td className="p-2.5 text-slate-600">{p.paymentDate} at {p.paymentTime}</td>
                              <td className="p-2.5 text-slate-600">{p.paymentMethod}</td>
                              <td className="p-2.5 text-right font-mono text-emerald-600">+{p.amountPaid.toLocaleString()} PKR</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 6. Timeline and Due Dates */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="font-bold">Next Scheduled Installment Due Date</p>
                  </div>
                  <p className="text-slate-600 font-mono pl-6">
                    {student.pendingAmount > 0 ? (
                      <>
                        The next installment of outstanding fees must be logged on or before: <span className="font-bold text-slate-900 underline">{student.nextInstallmentDate || student.dueDate || "N/A"}</span>
                      </>
                    ) : (
                      <span className="text-emerald-700 font-bold">This student ledger has been fully cleared! No further balance payments are required.</span>
                    )}
                  </p>
                </div>

                {/* 7. Institutional Signature stamp section */}
                <div className="grid grid-cols-2 gap-12 pt-16">
                  <div className="text-center space-y-2 border-t border-slate-300 pt-3">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">STUDENT SIGNATURE</p>
                    <p className="text-[8px] text-slate-400">Acknowledging ledger balance accuracy</p>
                  </div>
                  <div className="text-center space-y-2 border-t border-slate-300 pt-3 relative">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">AUTHORIZED STAMP & SIGN</p>
                    <p className="text-[8px] text-slate-400">DM Rush Institute Registrar Desk</p>
                  </div>
                </div>

                {/* 8. Bottom Institutional legal notes */}
                <div className="pt-6 border-t border-slate-200 text-center text-[8px] text-slate-400 space-y-1 leading-relaxed leading-3 italic">
                  <p>
                    "All tuition fees and down-payments are governed by the DM Rush Institute's operational policies. All logged transactions are backed by active security ledger audit records."
                  </p>
                  <p className="font-mono text-[7px] text-slate-300 uppercase not-italic">
                    Ledger Sync Timestamp: {new Date().toISOString()} • Authenticated Signature Registered
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
