import React, { useState } from "react";
import { 
  CreditCard, Search, Plus, Eye, Printer, Send, ShieldCheck, CheckCircle2, 
  DollarSign, TrendingUp, AlertTriangle, FileText, ArrowRight, Share2, Clipboard, ChevronRight
} from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { Student, Payment, PaymentMethod, UserRole } from "../types.js";
import { DMRushLogo } from "./DMRushLogo.js";

interface AccountsViewProps {
  paymentModalStudent: Student | null;
  setPaymentModalStudent: (student: Student | null) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  paymentModalStudent,
  setPaymentModalStudent
}) => {
  const { 
    students, payments, submitPayment, courses, batches, settings, currentUser 
  } = useApp();

  // Receipt modal
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Filter & Searches
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  // Receive Fee form states
  const [payStudentId, setPayStudentId] = useState<string>("");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [payNotes, setPayNotes] = useState<string>("");

  // Quick stats
  const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalReceivables = students.reduce((sum, s) => sum + s.pendingAmount, 0);
  const currentMonthTotal = payments
    .filter(p => p.paymentDate.startsWith("2026-07"))
    .reduce((sum, p) => sum + p.amountPaid, 0);

  // Handle Submit Payment
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudentId = payStudentId || (paymentModalStudent ? paymentModalStudent.id : "");
    
    if (!targetStudentId || payAmount <= 0) {
      alert("Please select a student and enter a valid payment amount.");
      return;
    }

    const student = students.find(s => s.id === targetStudentId);
    if (!student) return;

    if (payAmount > student.pendingAmount) {
      alert(`DENIED: Payment exceeds outstanding balance. Student only owes ${student.pendingAmount} PKR.`);
      return;
    }

    const newPayment = await submitPayment({
      studentId: targetStudentId,
      amountPaid: Number(payAmount),
      paymentMethod: payMethod,
      notes: payNotes || "Installment received"
    });

    if (newPayment) {
      alert(`Success! Receipt ${newPayment.id} logged.`);
      setPayStudentId("");
      setPayAmount(0);
      setPayNotes("");
      setPaymentModalStudent(null);
      // Auto-open generated receipt
      setSelectedReceipt(newPayment);
    } else {
      alert("Billing transaction failed. Check ledger constraints.");
    }
  };

  // Pre-fill selection based on quick-trigger modal state
  const targetStudent = paymentModalStudent || students.find(s => s.id === payStudentId);

  // Filtering receipts
  const filteredPayments = payments.filter(pay => {
    const searchMatch = 
      pay.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const methodMatch = methodFilter === "all" || pay.paymentMethod === methodFilter;
    return searchMatch && methodMatch;
  });

  // Prepare Whatsapp receipt text
  const generateWhatsAppMessage = (rcp: Payment) => {
    const instName = settings?.instituteName || "DM Rush Institute";
    const instPhone = settings?.phone || "+92 301 7786667";
    const text = 
`*${instName} - FEE PAYMENT RECEIPT*
----------------------------------------
*Receipt No:* ${rcp.id}
*Date/Time:* ${rcp.paymentDate} at ${rcp.paymentTime}
*Student:* ${rcp.studentName} (${rcp.studentId})
*Program:* ${rcp.courseName}
----------------------------------------
*Amount Paid:* ${rcp.amountPaid.toLocaleString()} PKR
*Previous Balance:* ${rcp.previousBalance.toLocaleString()} PKR
*Outstanding Balance:* ${rcp.remainingBalance.toLocaleString()} PKR
*Payment Method:* ${rcp.paymentMethod}
*Accountant:* ${rcp.accountantName}
----------------------------------------
_This is an automatically generated billing notification. Thank you for choosing DM Rush._
_For queries, call: ${instPhone}_`;
    
    return encodeURIComponent(text);
  };

  // Direct trigger whatsapp message
  const triggerWhatsAppShare = (rcp: Payment) => {
    const studentObj = students.find(s => s.id === rcp.studentId);
    let targetPhone = studentObj ? studentObj.phone : "";
    
    // Clean phone number (replace dash, spaces, and make sure international prefix is correct)
    targetPhone = targetPhone.replace(/[^0-9]/g, "");
    if (targetPhone.startsWith("0")) {
      targetPhone = "92" + targetPhone.substring(1);
    }
    
    const url = `https://wa.me/${targetPhone}?text=${generateWhatsAppMessage(rcp)}`;
    window.open(url, "_blank");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="accounts-view-root">
      
      {/* 1. Page Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Financial ledger & Accounts Center</h2>
        <p className="text-[11px] text-slate-400">Balance enrollment ledgers, collect installment fees, and generate thermal receipts.</p>
      </div>

      {/* 2. Top Billing Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Lifetime Collections</p>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight font-mono mt-1">
              {totalCollected.toLocaleString()} <span className="text-xs text-slate-400">PKR</span>
            </h3>
            <span className="text-[9px] text-slate-400 block mt-1">All processed transactions</span>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Receivable Balance</p>
            <h3 className="text-xl font-extrabold text-red-600 tracking-tight font-mono mt-1">
              {totalReceivables.toLocaleString()} <span className="text-xs text-slate-400">PKR</span>
            </h3>
            <span className="text-[9px] text-slate-400 block mt-1">Outstanding active tuition</span>
          </div>
          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono font-bold">This Month collections</p>
            <h3 className="text-xl font-extrabold text-blue-600 tracking-tight font-mono mt-1">
              {currentMonthTotal.toLocaleString()} <span className="text-xs text-slate-400">PKR</span>
            </h3>
            <span className="text-[9px] text-slate-400 block mt-1">Collections during July</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Columns: Record Payment and Receipt Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Process Payment Receipt Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 self-start">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Process billing Transaction</h3>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs font-medium">
            
            {/* Student ID selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Select Registered Student *</label>
              {paymentModalStudent ? (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center text-xs font-semibold">
                  <div>
                    <p className="text-blue-900 font-bold">{paymentModalStudent.name}</p>
                    <p className="text-[10px] text-blue-500 font-mono mt-0.5">{paymentModalStudent.id}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setPaymentModalStudent(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-700 font-bold"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <select
                  required
                  value={payStudentId}
                  onChange={(e) => {
                    setPayStudentId(e.target.value);
                    const std = students.find(s => s.id === e.target.value);
                    if (std) setPayAmount(std.pendingAmount);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="">-- Choose Student Ledger --</option>
                  {students
                    .filter(s => s.pendingAmount > 0 && s.status !== "Dropped")
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id} - owes {s.pendingAmount.toLocaleString()} PKR)</option>
                    ))}
                </select>
              )}
            </div>

            {/* Quick Balance indicator */}
            {targetStudent && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total course fee:</span>
                  <span className="font-mono text-slate-800 font-bold">{(targetStudent.totalFee - targetStudent.discount).toLocaleString()} PKR</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">Already collected:</span>
                  <span className="font-mono text-emerald-600 font-bold">+{targetStudent.paidAmount.toLocaleString()} PKR</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/60 pt-1.5 mt-1.5 font-bold">
                  <span className="text-slate-800">Remaining Balance:</span>
                  <span className="font-mono text-red-600">{targetStudent.pendingAmount.toLocaleString()} PKR</span>
                </div>
              </div>
            )}

            {/* Amount input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Received Amount (PKR) *</label>
              <input
                type="number"
                required
                value={payAmount || ""}
                onChange={(e) => setPayAmount(Math.max(0, Number(e.target.value)))}
                placeholder="Enter paid amount"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Gateway selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Payment Method *</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value={PaymentMethod.Cash}>Cash Payment</option>
                <option value={PaymentMethod.BankTransfer}>Bank Transfer</option>
                <option value={PaymentMethod.JazzCash}>JazzCash Mobile</option>
                <option value={PaymentMethod.EasyPaisa}>EasyPaisa Mobile</option>
              </select>
            </div>

            {/* Receipt Notes */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Remarks / Receipt Note</label>
              <input
                type="text"
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                placeholder="e.g. Received third installment"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md shadow-blue-600/10 flex items-center justify-center space-x-1.5 transition-colors"
              id="btn-process-payment-submit"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Authorize Billing & Receipt</span>
            </button>

          </form>
        </div>

        {/* Right Column: Receipt Records Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Issued Billing Receipts</h3>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {filteredPayments.length} Total Issued
            </span>
          </div>

          {/* Quick search filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search receipts by ID, student..."
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 focus:outline-none"
              />
            </div>
            
            <div className="w-full sm:w-36">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded bg-slate-50/50 focus:outline-none"
              >
                <option value="all">All Gateways</option>
                {Object.values(PaymentMethod).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payments list table */}
          {filteredPayments.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-12">No matching transactions logged in database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                    <th className="py-2.5 px-3">Receipt ID</th>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Gateway</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Amount Paid</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {filteredPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{p.id}</td>
                      <td className="py-2.5 px-3">
                        <div>
                          <p className="font-bold text-slate-800">{p.studentName}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{p.studentId}</p>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">{p.paymentMethod}</td>
                      <td className="py-2.5 px-3">{p.paymentDate}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-mono font-bold">+{p.amountPaid.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                          title="Generate slip invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* 4. MODAL: Receipt Slip Generator (Thermal 80mm format) */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-100 no-print" id="receipt-invoice-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden flex flex-col h-[90vh]">
            
            {/* Header controls */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Issued Receipt Slip</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-800 text-xs font-semibold">Close</button>
            </div>

            {/* Printable Receipt Body (Scrollable in modal) */}
            <div className="p-6 overflow-y-auto flex-1 font-sans bg-slate-100 flex justify-center">
              
              <div className="bg-white p-5 border border-slate-200 shadow-md rounded-lg w-full max-w-[80mm] text-slate-800 printable-receipt" id="printable-invoice-body">
                
                {/* Institute details */}
                <div className="text-center space-y-1.5 border-b border-slate-200 pb-3">
                  <div className="flex justify-center my-1">
                    <DMRushLogo height="h-8" textColor="black" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-tight">{settings?.instituteName || "DM Rush Institute"}</h4>
                  <p className="text-[9px] text-slate-400 font-mono leading-relaxed">{settings?.address}</p>
                  <p className="text-[9px] text-slate-500 font-mono">Ph: {settings?.phone} • Email: {settings?.email}</p>
                </div>

                {/* Receipt credentials */}
                <div className="py-2.5 border-b border-dashed border-slate-200 text-[10px] space-y-1 font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Date:</span>
                    <span className="font-mono text-slate-900">{selectedReceipt.paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Time:</span>
                    <span className="font-mono text-slate-900">{selectedReceipt.paymentTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accountant:</span>
                    <span className="text-slate-900">{selectedReceipt.accountantName}</span>
                  </div>
                </div>

                {/* Student biographical credentials */}
                <div className="py-2.5 border-b border-dashed border-slate-200 text-[10px] space-y-1 font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Student ID:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedReceipt.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student Name:</span>
                    <span className="font-bold text-slate-900 uppercase">{selectedReceipt.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enrolled Course:</span>
                    <span className="text-slate-900 truncate max-w-[150px]">{selectedReceipt.courseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Course Batch:</span>
                    <span className="font-mono text-slate-900">{selectedReceipt.batchName}</span>
                  </div>
                </div>

                {/* Financial accounts tally */}
                <div className="py-3 border-b border-dashed border-slate-200 space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between text-slate-500 font-sans">
                    <span>Previous Outstanding:</span>
                    <span className="font-bold text-slate-800">{selectedReceipt.previousBalance.toLocaleString()} PKR</span>
                  </div>

                  <div className="flex justify-between text-slate-900 font-sans text-xs font-bold pt-1">
                    <span>AMOUNT RECEIVED:</span>
                    <span className="text-emerald-600">+{selectedReceipt.amountPaid.toLocaleString()} PKR</span>
                  </div>

                  <div className="flex justify-between text-slate-500 font-sans border-t border-slate-100 pt-1.5 mt-1">
                    <span>Gateways method:</span>
                    <span className="font-bold text-slate-800">{selectedReceipt.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between text-slate-900 font-sans font-bold pt-1">
                    <span>LEDGER BALANCE OWED:</span>
                    <span className="text-red-600">{selectedReceipt.remainingBalance.toLocaleString()} PKR</span>
                  </div>
                </div>

                {/* Disclaimer / receipt note */}
                <div className="pt-3 text-center space-y-3">
                  <p className="text-[8px] text-slate-400 font-sans leading-relaxed leading-3 italic">
                    "{settings?.receiptNote || "Fees once paid are non-refundable & non-transferable."}"
                  </p>
                  
                  <div className="space-y-1 py-1 font-mono">
                    <div className="text-[7px] text-slate-400 uppercase tracking-widest">
                      Receipt {selectedReceipt.id}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom action controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex space-x-2 shrink-0">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice Slip</span>
              </button>

              <button
                onClick={() => triggerWhatsAppShare(selectedReceipt)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
