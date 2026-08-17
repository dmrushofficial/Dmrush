import React, { useState } from "react";
import { 
  FileText, Download, Printer, Filter, Calendar, AlertCircle, BookOpen, Users, DollarSign, ArrowUpRight
} from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { StudentStatus, PaymentMethod } from "../types.js";

type ReportType = 
  | "admissions" 
  | "revenue" 
  | "daily_collection" 
  | "monthly_collection" 
  | "pending_fees" 
  | "installment_timeline" 
  | "course_enrollment" 
  | "accountant_audit";

export const ReportsView: React.FC = () => {
  const { students, payments, courses, batches, logs } = useApp();
  const [selectedReport, setSelectedReport] = useState<ReportType>("admissions");
  
  // Custom date parameters
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
  const [startDate, setStartDate] = useState<string>(`${today.slice(0, 4)}-01-01`);
  const [endDate, setEndDate] = useState<string>(today);

  // Filter helpers
  const filterByDate = (dateStr: string) => {
    if (!dateStr) return false;
    return dateStr >= startDate && dateStr <= endDate;
  };

  // Compile Reports Data dynamically
  const getAdmissionsData = () => {
    return students.filter(s => filterByDate(s.admissionDate));
  };

  const getRevenueData = () => {
    return payments.filter(p => filterByDate(p.paymentDate));
  };

  const getDailyCollectionData = () => {
    // Group payments by date
    const grouped: { [date: string]: { cash: number; bank: number; jazz: number; easy: number; total: number } } = {};
    payments.forEach(p => {
      const date = p.paymentDate;
      if (!grouped[date]) {
        grouped[date] = { cash: 0, bank: 0, jazz: 0, easy: 0, total: 0 };
      }
      if (p.paymentMethod === PaymentMethod.Cash) grouped[date].cash += p.amountPaid;
      if (p.paymentMethod === PaymentMethod.BankTransfer) grouped[date].bank += p.amountPaid;
      if (p.paymentMethod === PaymentMethod.JazzCash) grouped[date].jazz += p.amountPaid;
      if (p.paymentMethod === PaymentMethod.EasyPaisa) grouped[date].easy += p.amountPaid;
      grouped[date].total += p.amountPaid;
    });

    return Object.keys(grouped)
      .filter(date => date >= startDate && date <= endDate)
      .map(date => ({ date, ...grouped[date] }))
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const getPendingFeesData = () => {
    return students.filter(s => s.pendingAmount > 0 && s.status !== "Dropped");
  };

  const getAccountantAuditData = () => {
    // Audit logs of payments or accountant logins
    return logs.filter(l => (l.action.includes("Payment") || l.action.includes("Login")) && filterByDate(l.date));
  };

  const getCourseEnrollmentsData = () => {
    return courses.map(c => {
      const courseStudents = students.filter(s => s.courseId === c.id);
      const totalEnrolled = courseStudents.length;
      const activeEnrolled = courseStudents.filter(s => s.status === StudentStatus.Active).length;
      const completedEnrolled = courseStudents.filter(s => s.status === StudentStatus.Completed).length;
      const totalFeesCollected = payments
        .filter(p => students.find(s => s.id === p.studentId)?.courseId === c.id)
        .reduce((sum, p) => sum + p.amountPaid, 0);

      return {
        id: c.id,
        name: c.name,
        total: totalEnrolled,
        active: activeEnrolled,
        completed: completedEnrolled,
        collected: totalFeesCollected
      };
    });
  };

  // Run Excel/CSV conversion and trigger downloads
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let fileName = `report-${selectedReport}.csv`;

    if (selectedReport === "admissions") {
      headers = ["Student ID", "Full Name", "CNIC", "Phone", "Course ID", "Admission Date", "Status", "Owed Balance"];
      rows = getAdmissionsData().map(s => [
        s.id, s.name, s.cnic, s.phone, s.courseId, s.admissionDate, s.status, s.pendingAmount
      ]);
    } else if (selectedReport === "revenue") {
      headers = ["Receipt ID", "Student ID", "Student Name", "Course", "Amount Paid", "Gateway Method", "Transaction Date"];
      rows = getRevenueData().map(p => [
        p.id, p.studentId, p.studentName, p.courseName, p.amountPaid, p.paymentMethod, p.paymentDate
      ]);
    } else if (selectedReport === "daily_collection") {
      headers = ["Collection Date", "Cash Received", "Bank Received", "JazzCash Received", "EasyPaisa", "Net Total"];
      rows = getDailyCollectionData().map(d => [
        d.date, d.cash, d.bank, d.jazz, d.easy, d.total
      ]);
    } else if (selectedReport === "pending_fees") {
      headers = ["Student ID", "Full Name", "Phone", "Admission Date", "Discount Owed", "Paid", "Pending Balance", "Next Installment Date"];
      rows = getPendingFeesData().map(s => [
        s.id, s.name, s.phone, s.admissionDate, s.discount, s.paidAmount, s.pendingAmount, s.nextInstallmentDate
      ]);
    } else if (selectedReport === "course_enrollment") {
      headers = ["Course ID", "Course Title", "Total Enrolled", "Active Count", "Alumni Count", "Fees Collected"];
      rows = getCourseEnrollmentsData().map(c => [
        c.id, c.name, c.total, c.active, c.completed, c.collected
      ]);
    } else {
      // General Fallback
      headers = ["ID", "Parameter", "Timestamp", "Audit Activity"];
      rows = getAccountantAuditData().map(l => [
        l.id, l.user, `${l.date} ${l.time}`, `${l.action} - ${l.details}`
      ]);
    }

    // Compose CSV Text
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="reports-view-root">
      
      {/* 1. Header and Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 no-print">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Executive reports & analytics Hub</h2>
          <p className="text-[11px] text-slate-400">Generate, compile and export audit ledgers, student demographics, and collection spreadsheets.</p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex space-x-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded border border-slate-300 flex items-center space-x-1.5"
            id="btn-export-csv"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Excel Sheet</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded shadow flex items-center space-x-1.5"
            id="btn-export-pdf"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. Parameters Selectors (Filters Panel) */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold no-print">
        
        {/* Selector: Report Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Select Report Schema</label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value as ReportType)}
            className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/60"
          >
            <option value="admissions">Student Admissions Report</option>
            <option value="revenue">Revenues Transaction Log</option>
            <option value="daily_collection">Daily Gateway Collections</option>
            <option value="pending_fees">Outstanding Balances Owed</option>
            <option value="course_enrollment">Course wise Enrollments ratio</option>
            <option value="accountant_audit">Accountant Activities Log</option>
          </select>
        </div>

        {/* Date: Start */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Timeframe Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full mt-1.5 px-3 py-1.5 border border-slate-200 rounded-lg font-mono focus:outline-none"
          />
        </div>

        {/* Date: End */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Timeframe End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full mt-1.5 px-3 py-1.5 border border-slate-200 rounded-lg font-mono focus:outline-none"
          />
        </div>

        {/* Stats card inside filter row */}
        <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-3 text-xs">
          <FileText className="w-8 h-8 text-blue-600 shrink-0" />
          <div>
            <p className="text-[9px] font-bold text-blue-500 uppercase font-mono">Scope Parameters</p>
            <p className="text-slate-700 font-bold mt-0.5">Custom Date Range Filter</p>
          </div>
        </div>

      </div>

      {/* 3. Render compiled tables (The actual report data sheet) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6 printable-report">
        
        {/* Custom Print Header (Only visible on print flows) */}
        <div className="hidden print-only text-center border-b border-slate-300 pb-4 space-y-1.5 mb-6">
          <h2 className="text-sm font-bold uppercase font-mono tracking-widest text-slate-900">DM Rush Institute</h2>
          <h3 className="text-xs font-bold uppercase tracking-tight">Administrative Intelligence Report Ledger</h3>
          <p className="text-[10px] text-slate-400 font-mono">Compiled dynamically from {startDate} to {endDate}</p>
        </div>

        {/* Title row */}
        <div className="border-b border-slate-100 pb-3.5 flex justify-between items-end">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              {selectedReport === "admissions" && "Student Registrations Database"}
              {selectedReport === "revenue" && "Financial Income Streams log"}
              {selectedReport === "daily_collection" && "Daily Payments Collections Tally"}
              {selectedReport === "pending_fees" && "Arrears Ledger Outstanding"}
              {selectedReport === "course_enrollment" && "Coursewise Student Metrics"}
              {selectedReport === "accountant_audit" && "Logins & Cashier Audit Trail"}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Compiled list from <span className="font-bold font-mono">{startDate}</span> to <span className="font-bold font-mono">{endDate}</span>
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded uppercase">
            Data Output List
          </span>
        </div>

        {/* RENDER ADMISSIONS */}
        {selectedReport === "admissions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Admission Date</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Academic Status</th>
                  <th className="py-2.5 px-3 text-right">Owed Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {getAdmissionsData().map(s => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.id}</td>
                    <td className="py-2.5 px-3">{s.name}</td>
                    <td className="py-2.5 px-3 font-mono">{s.admissionDate}</td>
                    <td className="py-2.5 px-3 font-mono">{s.phone}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold uppercase">{s.status}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-red-600 font-bold">
                      {s.pendingAmount.toLocaleString()} PKR
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RENDER REVENUE */}
        {selectedReport === "revenue" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Gateway</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {getRevenueData().map(p => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{p.id}</td>
                    <td className="py-2.5 px-3 font-mono">{p.studentId}</td>
                    <td className="py-2.5 px-3">{p.studentName}</td>
                    <td className="py-2.5 px-3 font-mono">{p.paymentMethod}</td>
                    <td className="py-2.5 px-3 font-mono">{p.paymentDate}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-mono font-bold">
                      +{p.amountPaid.toLocaleString()} PKR
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RENDER DAILY COLLECTION */}
        {selectedReport === "daily_collection" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <th className="py-2.5 px-3">Collection Date</th>
                  <th className="py-2.5 px-3">Cash Sum</th>
                  <th className="py-2.5 px-3">Bank Transfer</th>
                  <th className="py-2.5 px-3">JazzCash Mobile</th>
                  <th className="py-2.5 px-3">EasyPaisa</th>
                  <th className="py-2.5 px-3 text-right">Net Collection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {getDailyCollectionData().map(d => (
                  <tr key={d.date}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{d.date}</td>
                    <td className="py-2.5 px-3 font-mono">{d.cash.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono">{d.bank.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono">{d.jazz.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono">{d.easy.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">
                      {d.total.toLocaleString()} PKR
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RENDER PENDING FEES */}
        {selectedReport === "pending_fees" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Paid Amount</th>
                  <th className="py-2.5 px-3 text-right">Outstanding Bal</th>
                  <th className="py-2.5 px-3">Next installment Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {getPendingFeesData().map(s => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.id}</td>
                    <td className="py-2.5 px-3">{s.name}</td>
                    <td className="py-2.5 px-3 font-mono">{s.phone}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600">+{s.paidAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-red-600 font-bold">
                      {s.pendingAmount.toLocaleString()} PKR
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{s.nextInstallmentDate || "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RENDER COURSE ENROLLMENTS */}
        {selectedReport === "course_enrollment" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <th className="py-2.5 px-3">Program ID</th>
                  <th className="py-2.5 px-3">Course Title Name</th>
                  <th className="py-2.5 px-3 text-center">Total Registrations</th>
                  <th className="py-2.5 px-3 text-center">Active Enrolled</th>
                  <th className="py-2.5 px-3 text-center">Completed Alumni</th>
                  <th className="py-2.5 px-3 text-right">Gross revenue Collected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {getCourseEnrollmentsData().map(c => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.id}</td>
                    <td className="py-2.5 px-3 font-bold">{c.name}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{c.total}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-green-600">{c.active}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-blue-600">{c.completed}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">
                      {c.collected.toLocaleString()} PKR
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RENDER ACCOUNTANT AUDIT */}
        {selectedReport === "accountant_audit" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Accountant Operator</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {getAccountantAuditData().map(l => (
                  <tr key={l.id}>
                    <td className="py-2.5 px-3 font-mono">{l.id}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-bold">{l.user}</td>
                    <td className="py-2.5 px-3 font-mono">{l.date} at {l.time}</td>
                    <td className="py-2.5 px-3 truncate max-w-sm" title={l.details}>{l.action} • {l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
