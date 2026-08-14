import React from "react";
import { 
  Users, UserCheck, GraduationCap, XCircle, BookOpen, AlertTriangle, 
  TrendingUp, Calendar, Wallet, ArrowUpRight, ArrowDownRight, Clock
} from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { StudentStatus, CourseStatus, BatchStatus, PaymentMethod } from "../types.js";

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  setSelectedStudentIdForProfile?: (id: string | null) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  setActiveTab,
  setSelectedStudentIdForProfile
}) => {
  const { students, courses, batches, payments, inquiries, logs } = useApp();

  // Get current date string for calculations matching user timestamp 2026-07-21
  const todayStr = "2026-07-21";
  const currentMonthPrefix = "2026-07";

  // 1. Calculations for KPIs
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === StudentStatus.Active).length;
  const completedStudents = students.filter(s => s.status === StudentStatus.Completed).length;
  const droppedStudents = students.filter(s => s.status === StudentStatus.Dropped).length;
  
  const totalCoursesCount = courses.length;
  const runningCoursesCount = courses.filter(c => c.status === CourseStatus.Active).length;
  
  const pendingFeeAmount = students.reduce((sum, s) => sum + s.pendingAmount, 0);
  const totalRevenue = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  
  const monthlyRevenue = payments
    .filter(p => p.paymentDate.startsWith(currentMonthPrefix))
    .reduce((sum, p) => sum + p.amountPaid, 0);
    
  const todaysRevenue = payments
    .filter(p => p.paymentDate === todayStr)
    .reduce((sum, p) => sum + p.amountPaid, 0);
    
  const todaysAdmissions = students
    .filter(s => s.admissionDate === todayStr)
    .length;

  const upcomingInstallments = students.filter(s => {
    if (s.pendingAmount <= 0 || !s.nextInstallmentDate) return false;
    if (s.status === StudentStatus.Dropped || s.status === StudentStatus.Completed) return false;
    const due = new Date(s.nextInstallmentDate);
    const today = new Date(todayStr);
    return due >= today;
  }).length;

  const overdueInstallmentsList = students.filter(s => {
    if (s.pendingAmount <= 0 || !s.nextInstallmentDate) return false;
    if (s.status === StudentStatus.Dropped || s.status === StudentStatus.Completed) return false;
    const due = new Date(s.nextInstallmentDate);
    const today = new Date(todayStr);
    return due < today;
  });
  
  const overdueInstallments = overdueInstallmentsList.length;

  // Recent lists
  const recentAdmissions = students.slice(0, 4);
  const recentPayments = payments.slice(0, 4);

  // Chart Helper Calculations
  // Course Wise Students
  const courseDistribution = courses.map(course => {
    const count = students.filter(s => s.courseId === course.id).length;
    return { name: course.name, count };
  });

  // Payment Methods Distribution
  const paymentMethodsList = Object.values(PaymentMethod);
  const methodDistribution = paymentMethodsList.map(method => {
    const amt = payments
      .filter(p => p.paymentMethod === method)
      .reduce((sum, p) => sum + p.amountPaid, 0);
    return { method, amt };
  });

  const totalMethodAmt = methodDistribution.reduce((sum, m) => sum + m.amt, 0) || 1;

  // Student Profile Shortcut helper
  const handleViewStudentProfile = (studentId: string) => {
    if (setSelectedStudentIdForProfile) {
      setSelectedStudentIdForProfile(studentId);
    }
    setActiveTab("students");
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200" id="dashboard-view-root">
      
      {/* 1. Welcoming Hero Banner Card */}
      <div className="p-6 bg-[#0F172A] rounded-xl border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="z-10">
          <span className="text-xs font-mono text-blue-400 font-bold tracking-widest uppercase">System Control Center</span>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-white mt-1">DM Rush Administrative Workspace</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Welcome back! Here is a centralized executive summary of registrations, collection ledgers, and CRM lead interactions at the institute.
          </p>
        </div>
        <div className="mt-4 md:mt-0 z-10 flex space-x-2">
          <button 
            onClick={() => setActiveTab("accounts")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            Process Receipt
          </button>
          <button 
            onClick={() => setActiveTab("students")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Admit Student
          </button>
        </div>
      </div>

      {/* 2. Top Tier KPIs - Core Financial and Registration Aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI: Total Registrations */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Total Registrations</p>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight font-mono">{totalStudents}</h3>
            <span className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Core Database
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI: Active Enrollment */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Active Classrooms</p>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight font-mono">{activeStudents}</h3>
            <span className="text-[10px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
              In Sessions
            </span>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* KPI: Running Academic Courses */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Academic Courses</p>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight font-mono">{totalCoursesCount}</h3>
            <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full font-mono">
              {runningCoursesCount} In Catalog
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* KPI: Lifetime Revenues */}
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Lifetime Collections</p>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight font-mono">
              {totalRevenue.toLocaleString()} <span className="text-xs text-slate-400">PKR</span>
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Full Ledger
            </span>
          </div>
        </div>

      </div>

      {/* 3. Secondary KPIs - Operational, Monthly and Alerts Aggregates */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* KPI Card: Monthly Collections */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">This Month</p>
          <h4 className="text-lg font-bold text-slate-800 font-mono tracking-tight mt-1">{monthlyRevenue.toLocaleString()}</h4>
          <span className="text-[9px] text-slate-400 mt-1 block">July Collection</span>
        </div>

        {/* KPI Card: Today Revenue */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Today Revenue</p>
          <h4 className="text-lg font-bold text-slate-800 font-mono tracking-tight mt-1">{todaysRevenue.toLocaleString()}</h4>
          <span className="text-[9px] text-slate-400 mt-1 block">PKR received today</span>
        </div>

        {/* KPI Card: Today Admissions */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Admissions Today</p>
          <h4 className="text-lg font-bold text-slate-800 font-mono tracking-tight mt-1">{todaysAdmissions}</h4>
          <span className="text-[9px] text-blue-500 font-medium block">New Students</span>
        </div>

        {/* KPI Card: Overdue Ledger */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm ring-1 ring-red-500/10">
          <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider font-mono">Overdue Accounts</p>
          <h4 className="text-lg font-extrabold text-red-600 font-mono tracking-tight mt-1">{overdueInstallments}</h4>
          <span className="text-[9px] text-red-400 block font-bold font-mono">PKR Actionable</span>
        </div>

        {/* KPI Card: Pending Total Receivable */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm ring-1 ring-amber-500/10">
          <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider font-mono">Total Receivable</p>
          <h4 className="text-lg font-extrabold text-amber-600 font-mono tracking-tight mt-1">{pendingFeeAmount.toLocaleString()}</h4>
          <span className="text-[9px] text-slate-400 block">PKR in accounts</span>
        </div>

        {/* KPI Card: Completed Students */}
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Alumni</p>
          <h4 className="text-lg font-bold text-slate-800 font-mono tracking-tight mt-1">{completedStudents}</h4>
          <span className="text-[9px] text-slate-400 block">{droppedStudents} dropped out</span>
        </div>

      </div>

      {/* 4. Visual Analytics & Custom SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Chart Panel: Course Wise Students */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-100 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Academic Course Enrollments</h3>
              <p className="text-[11px] text-slate-400 font-sans">Active ratio of registered students per academic course</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
              DB Count Metric
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {courseDistribution.map((course, i) => {
              const percentage = Math.round((course.count / (totalStudents || 1)) * 100);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700 truncate max-w-sm">{course.name}</span>
                    <span className="font-mono text-slate-600">{course.count} Students ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-500
                        ${i === 0 ? "bg-blue-600" : ""}
                        ${i === 1 ? "bg-amber-500" : ""}
                        ${i === 2 ? "bg-emerald-500" : ""}
                        ${i === 3 ? "bg-indigo-500" : ""}
                      `}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SVG Chart Panel: Payment Methods distribution */}
        <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Payment Gateways</h3>
              <p className="text-[11px] text-slate-400 font-sans">Revenue share collected across methods</p>
            </div>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="space-y-5 pt-3">
            {methodDistribution.map((item, i) => {
              const pct = Math.round((item.amt / totalMethodAmt) * 100);
              return (
                <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full
                      ${item.method === PaymentMethod.Cash ? "bg-emerald-500" : ""}
                      ${item.method === PaymentMethod.BankTransfer ? "bg-blue-600" : ""}
                      ${item.method === PaymentMethod.JazzCash ? "bg-amber-500" : ""}
                      ${item.method === PaymentMethod.EasyPaisa ? "bg-indigo-500" : ""}
                    `} />
                    <span className="text-slate-600 font-semibold">{item.method}</span>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-slate-800 font-bold">{item.amt.toLocaleString()} PKR</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{pct}% ratio</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 5. Live Operational Widgets - Admissions, Payments & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget: Recent Admissions */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Recent Admissions</h3>
            <button 
              onClick={() => setActiveTab("students")} 
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Registry File
            </button>
          </div>

          <div className="space-y-3.5">
            {recentAdmissions.map((student) => (
              <div 
                key={student.id} 
                onClick={() => handleViewStudentProfile(student.id)}
                className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs font-mono">
                    {student.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{student.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{student.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
                    ${student.status === StudentStatus.Active ? "bg-green-100 text-green-800" : ""}
                    ${student.status === StudentStatus.Completed ? "bg-blue-100 text-blue-800" : ""}
                    ${student.status === StudentStatus.Dropped ? "bg-red-100 text-red-800" : ""}
                  `}>
                    {student.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{student.admissionDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget: Recent Payments Receipts */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Recent Payments</h3>
            <button 
              onClick={() => setActiveTab("accounts")} 
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Accounts File
            </button>
          </div>

          <div className="space-y-3.5">
            {recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{p.studentName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.id} • {p.paymentMethod}</p>
                </div>
                <div className="text-right font-mono">
                  <p className="text-xs font-extrabold text-emerald-600 font-bold">+{p.amountPaid.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{p.paymentDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget: Overdue Alerts & Actions */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Overdue Timeline Alerts</h3>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-mono">
              Actionable
            </span>
          </div>

          <div className="space-y-3.5 max-h-64 overflow-y-auto">
            {overdueInstallmentsList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                Awesome! No installments are currently overdue.
              </div>
            ) : (
              overdueInstallmentsList.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => handleViewStudentProfile(s.id)}
                  className="flex items-start space-x-3 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{s.name}</h4>
                    <p className="text-[10px] text-red-500 font-mono mt-0.5">
                      {s.pendingAmount.toLocaleString()} PKR Owed
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Due date: <span className="font-semibold font-mono">{s.nextInstallmentDate}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
