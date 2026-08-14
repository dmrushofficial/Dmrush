import React, { useState } from "react";
import { 
  Search, Filter, Plus, Eye, Edit3, Trash2, ArrowLeft, CreditCard, 
  User, Mail, Phone, Calendar, BookOpen, AlertCircle, FileText, CheckCircle, RefreshCw, Send
} from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { Student, Shift, StudentStatus, UserRole } from "../types.js";
import {
  PortalAccountInfo,
  PortalCredentialsCard,
  PortalCredentialsModal,
  savePortalCredentials,
} from "./PortalCredentialsModal.js";

interface StudentsViewProps {
  selectedStudentIdForProfile: string | null;
  setSelectedStudentIdForProfile: (id: string | null) => void;
  openPaymentModalWithStudent?: (student: Student) => void;
  onPrintFeeSlip?: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  selectedStudentIdForProfile,
  setSelectedStudentIdForProfile,
  openPaymentModalWithStudent,
  onPrintFeeSlip
}) => {
  const { 
    students, courses, batches, addStudent, updateStudent, deleteStudent, currentUser, payments, setActivePrintStudent 
  } = useApp();

  // Navigation states
  const [isAdmitting, setIsAdmitting] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [portalModal, setPortalModal] = useState<{
    student: Student;
    portalAccount?: PortalAccountInfo;
  } | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form States (Admissions)
  const [formName, setFormName] = useState<string>("");
  const [formFatherName, setFormFatherName] = useState<string>("");
  const [formCnic, setFormCnic] = useState<string>("");
  const [formPhone, setFormPhone] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formCourseId, setFormCourseId] = useState<string>("");
  const [formBatchId, setFormBatchId] = useState<string>("");
  const [formShift, setFormShift] = useState<Shift>(Shift.Morning);
  const [formNotes, setFormNotes] = useState<string>("");
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formPaid, setFormPaid] = useState<number>(0);

  // Auto assign fields based on course selection
  const handleCourseChange = (courseId: string) => {
    setFormCourseId(courseId);
    const selectedCourse = courses.find(c => c.id === courseId);
    
    // Auto filter batches and select first active
    const courseBatches = batches.filter(b => b.courseId === courseId);
    if (courseBatches.length > 0) {
      setFormBatchId(courseBatches[0].id);
    } else {
      setFormBatchId("");
    }
  };

  // Admission Submit handler
  const handleAdmitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCourseId || !formBatchId) {
      alert("Name, Course, and Batch are mandatory fields.");
      return;
    }
    if (!formEmail.trim()) {
      alert("Email is required so the student can access the Learn portal.");
      return;
    }

    const selectedCourse = courses.find(c => c.id === formCourseId);
    if (!selectedCourse) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const end = new Date();
    end.setMonth(end.getMonth() + 4); // Default to 4 months course duration
    const endStr = end.toISOString().split("T")[0];

    const studentPayload: Partial<Student> = {
      name: formName,
      fatherName: formFatherName,
      cnic: formCnic,
      phone: formPhone,
      email: formEmail.trim(),
      admissionDate: todayStr,
      courseId: formCourseId,
      batchId: formBatchId,
      shift: formShift,
      startDate: todayStr,
      endDate: endStr,
      duration: selectedCourse.duration,
      status: StudentStatus.Active,
      notes: formNotes,
      totalFee: selectedCourse.totalFee,
      discount: Number(formDiscount),
      paidAmount: Number(formPaid),
      dueDate: todayStr,
      nextInstallmentDate: Number(formPaid) < (selectedCourse.totalFee - Number(formDiscount)) ? todayStr : ""
    };

    const result = await addStudent(studentPayload);
    if (result?.student) {
      const { student, portalAccount } = result;
      if (portalAccount) {
        savePortalCredentials(student.id, portalAccount);
      }
      setIsAdmitting(false);
      resetFormStates();
      setPortalModal({ student, portalAccount });
    } else {
      alert("Registration failed on server. Check logs.");
    }
  };

  // Reset states helper
  const resetFormStates = () => {
    setFormName("");
    setFormFatherName("");
    setFormCnic("");
    setFormPhone("");
    setFormEmail("");
    setFormCourseId("");
    setFormBatchId("");
    setFormShift(Shift.Morning);
    setFormNotes("");
    setFormDiscount(0);
    setFormPaid(0);
  };

  // Edit states submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const payload: Partial<Student> = {
      name: editingStudent.name,
      fatherName: editingStudent.fatherName,
      cnic: editingStudent.cnic,
      phone: editingStudent.phone,
      email: editingStudent.email,
      courseId: editingStudent.courseId,
      batchId: editingStudent.batchId,
      shift: editingStudent.shift,
      status: editingStudent.status,
      notes: editingStudent.notes,
      totalFee: Number(editingStudent.totalFee),
      discount: Number(editingStudent.discount),
      nextInstallmentDate: editingStudent.nextInstallmentDate
    };

    const ok = await updateStudent(editingStudent.id, payload);
    if (ok) {
      alert("Student profile updated successfully.");
      setEditingStudent(null);
    } else {
      alert("Modification rejected by database server.");
    }
  };

  // Delete Student Profile Handler
  const handleDeleteStudent = async (id: string, name: string) => {
    if (currentUser.role !== UserRole.Admin) {
      alert("RESTRICTED: Only administrators can purge records from server.");
      return;
    }
    if (window.confirm(`Are you absolutely sure you want to PERMANENTLY DELETE student ${name} (ID: ${id})? This will purge all financial records and payment histories permanently.`)) {
      const ok = await deleteStudent(id);
      if (ok) {
        alert("Student profile successfully deleted from database.");
        if (selectedStudentIdForProfile === id) {
          setSelectedStudentIdForProfile(null);
        }
      }
    }
  };

  // Filtering Logic
  const filteredStudents = students.filter(student => {
    const searchMatch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cnic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const courseMatch = courseFilter === "all" || student.courseId === courseFilter;
    const batchMatch = batchFilter === "all" || student.batchId === batchFilter;
    const shiftMatch = shiftFilter === "all" || student.shift === shiftFilter;
    const statusMatch = statusFilter === "all" || student.status === statusFilter;

    return searchMatch && courseMatch && batchMatch && shiftMatch && statusMatch;
  });

  // Active student for profile display
  const activeProfile = students.find(s => s.id === selectedStudentIdForProfile);
  const activeProfileCourse = activeProfile ? courses.find(c => c.id === activeProfile.courseId) : null;
  const activeProfileBatch = activeProfile ? batches.find(b => b.id === activeProfile.batchId) : null;
  const activeProfileReceipts = activeProfile ? payments.filter(p => p.studentId === activeProfile.id) : [];

  return (
    <div className="space-y-6" id="students-view-root">
      
      {/* CASE 1: Student Profile Card Hub */}
      {activeProfile ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Action Row */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              onClick={() => setSelectedStudentIdForProfile(null)}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
              id="btn-back-to-registry"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Registry</span>
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setActivePrintStudent(activeProfile)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
                id="btn-print-admission-slip"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Admission Letter</span>
              </button>
              {onPrintFeeSlip && (
                <button
                  onClick={() => onPrintFeeSlip(activeProfile)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  id="btn-print-fee-slip"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download Fee Slip</span>
                </button>
              )}
              <button
                onClick={() => setEditingStudent(activeProfile)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
                id="btn-edit-student-profile"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Profile</span>
              </button>
              {activeProfile.pendingAmount > 0 && (
                <button
                  onClick={() => openPaymentModalWithStudent && openPaymentModalWithStudent(activeProfile)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-blue-600/10"
                  id="btn-pay-installment-profile"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Receive Installment</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Academic & Personal Profile Summary */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Card */}
              <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-100 text-blue-700 font-extrabold text-2xl rounded-full flex items-center justify-center font-sans shadow-inner">
                      {activeProfile.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{activeProfile.name}</h3>
                      <p className="text-xs font-mono text-slate-500">{activeProfile.id}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-xs font-bold uppercase
                        ${activeProfile.status === StudentStatus.Active ? "bg-green-100 text-green-800" : ""}
                        ${activeProfile.status === StudentStatus.Completed ? "bg-blue-100 text-blue-800" : ""}
                        ${activeProfile.status === StudentStatus.Dropped ? "bg-red-100 text-red-800" : ""}
                        ${activeProfile.status === StudentStatus.OnHold ? "bg-amber-100 text-amber-800" : ""}
                      `}>
                        {activeProfile.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Ledger Quick Summary */}
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Ledger State</p>
                    {activeProfile.pendingAmount > 0 ? (
                      <h4 className="text-lg font-extrabold text-red-600 font-mono mt-0.5">
                        {activeProfile.pendingAmount.toLocaleString()} <span className="text-xs font-semibold text-slate-500">PKR Owed</span>
                      </h4>
                    ) : (
                      <h4 className="text-lg font-extrabold text-emerald-600 mt-0.5 flex items-center justify-end">
                        <CheckCircle className="w-4 h-4 mr-1 text-emerald-500" /> Fully Paid
                      </h4>
                    )}
                  </div>
                </div>

                {/* Info Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Guardian Name</p>
                      <p className="font-semibold text-slate-800">{activeProfile.fatherName || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">CNIC / ID Card No</p>
                      <p className="font-semibold font-mono text-slate-800">{activeProfile.cnic || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Phone Number</p>
                      <p className="font-semibold text-slate-800">{activeProfile.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Email Address</p>
                      <p className="font-semibold text-slate-800">{activeProfile.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Admission Date</p>
                      <p className="font-semibold text-slate-800">{activeProfile.admissionDate || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-600">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Academic Program</p>
                      <p className="font-semibold text-slate-800">
                        {activeProfileCourse ? activeProfileCourse.name : "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>

                <PortalCredentialsCard
                  studentId={activeProfile.id}
                  studentEmail={activeProfile.email}
                  onReset={(portalAccount) => setPortalModal({ student: activeProfile, portalAccount })}
                />

                {/* Additional notes row */}
                {activeProfile.notes && (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Academic notes & followups</h5>
                    <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">{activeProfile.notes}</p>
                  </div>
                )}
              </div>

              {/* Transactions Ledger Card */}
              <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Payments history Ledger</h3>
                
                {activeProfileReceipts.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No transactions have been logged against this student ledger.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                          <th className="py-2.5 px-3">Receipt No</th>
                          <th className="py-2.5 px-3">Transaction Date</th>
                          <th className="py-2.5 px-3">Method</th>
                          <th className="py-2.5 px-3">Accountant</th>
                          <th className="py-2.5 px-3 text-right">Amount Received</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeProfileReceipts.map(rcp => (
                          <tr key={rcp.id} className="hover:bg-slate-50/60 font-medium">
                            <td className="py-2.5 px-3 font-mono font-semibold text-blue-600">{rcp.id}</td>
                            <td className="py-2.5 px-3 text-slate-600">{rcp.paymentDate} <span className="text-[10px] text-slate-400">{rcp.paymentTime}</span></td>
                            <td className="py-2.5 px-3 text-slate-600">{rcp.paymentMethod}</td>
                            <td className="py-2.5 px-3 text-slate-500">{rcp.accountantName}</td>
                            <td className="py-2.5 px-3 text-right text-emerald-600 font-mono font-bold">+{rcp.amountPaid.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Billing & Account Details */}
            <div className="space-y-6">
              
              {/* Financial Ledger card */}
              <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Accounts Breakdown</h3>
                
                <div className="space-y-3.5 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Standard Program Fee</span>
                    <span className="font-mono text-slate-800 font-bold">{activeProfile.totalFee.toLocaleString()} PKR</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Institute Scholarship Disc.</span>
                    <span className="font-mono text-amber-600 font-bold">-{activeProfile.discount.toLocaleString()} PKR</span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Adjusted Net Payable</span>
                    <span className="font-mono text-slate-800 font-extrabold">
                      {(activeProfile.totalFee - activeProfile.discount).toLocaleString()} PKR
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Collected to Date</span>
                    <span className="font-mono text-emerald-600 font-bold">+{activeProfile.paidAmount.toLocaleString()} PKR</span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">Owed Net Balance</span>
                    <span className={`font-mono text-lg font-extrabold
                      ${activeProfile.pendingAmount > 0 ? "text-red-600" : "text-emerald-600"}
                    `}>
                      {activeProfile.pendingAmount.toLocaleString()} PKR
                    </span>
                  </div>
                </div>
              </div>

              {/* Installment Due alerts card */}
              <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Installment Timelines</h3>
                
                {activeProfile.pendingAmount > 0 ? (
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 border border-amber-100 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p className="text-[11px]">
                        Installment timeline active. Balance collections must be logged.
                      </p>
                    </div>

                    <div className="space-y-1.5 p-1">
                      <p className="text-slate-400 font-medium text-[10px]">Upcoming Installment Due Date</p>
                      <p className="font-mono text-slate-800 font-bold text-sm">{activeProfile.nextInstallmentDate || "N/A"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <p className="text-[11px] font-bold">
                      Ledger is clear! No active pending installment deadlines are scheduled.
                    </p>
                  </div>
                )}
              </div>

              {/* Academic Details Summary Card */}
              <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Academic Course Timeline</h3>
                
                <div className="space-y-3.5 pt-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Batch</span>
                    <span className="font-mono text-slate-800 font-semibold">{activeProfileBatch ? activeProfileBatch.name : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class Shift Schedule</span>
                    <span className="text-slate-800 font-semibold">{activeProfile.shift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commenced Date</span>
                    <span className="font-mono text-slate-800 font-semibold">{activeProfile.startDate || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected End Date</span>
                    <span className="font-mono text-slate-800 font-semibold">{activeProfile.endDate || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Program Duration</span>
                    <span className="text-slate-800 font-semibold">{activeProfile.duration || "N/A"}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : isAdmitting ? (
        
        /* CASE 2: Admission Form */
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-150">
          
          {/* Header */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Admit Student & Register Ledger</h2>
              <p className="text-[11px] text-slate-400">Record biographical profiles and setup financial plans.</p>
            </div>
            <button
              onClick={() => setIsAdmitting(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAdmitSubmit} className="p-6 space-y-6">
            
            {/* Section 1: Biographical details */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
                I. Student biographical Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter full name of student"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Father Name / Guardian *</label>
                  <input
                    type="text"
                    required
                    value={formFatherName}
                    onChange={(e) => setFormFatherName(e.target.value)}
                    placeholder="Enter guardian name"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">CNIC / Identification card *</label>
                  <input
                    type="text"
                    required
                    value={formCnic}
                    onChange={(e) => setFormCnic(e.target.value)}
                    placeholder="42101-XXXXXXX-X"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Active Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address (Optional)</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Admissions & Batches assignment */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
                II. Course Registration Parameters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Interested Course *</label>
                  <select
                    required
                    value={formCourseId}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (PKR {c.totalFee.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Assigned Academic Batch *</label>
                  <select
                    required
                    value={formBatchId}
                    onChange={(e) => setFormBatchId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Batch --</option>
                    {batches
                      .filter(b => b.courseId === formCourseId)
                      .map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Class Schedule Shift *</label>
                  <select
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value as Shift)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={Shift.Morning}>Morning</option>
                    <option value={Shift.Evening}>Evening</option>
                    <option value={Shift.Weekend}>Weekend</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Billing & initial fees structure */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
                III. Financial Billing plan Setup
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Standard Course Fee</p>
                  <div className="text-sm font-bold font-mono py-2 text-slate-800">
                    {formCourseId ? (courses.find(c => c.id === formCourseId)?.totalFee || 0).toLocaleString() : 0} PKR
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Granted Discount (PKR)</label>
                  <input
                    type="number"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Admission Payment (PKR)</label>
                  <input
                    type="number"
                    value={formPaid}
                    onChange={(e) => setFormPaid(Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Receivable Balance Owed</p>
                  <div className="text-sm font-extrabold font-mono py-2 text-red-600">
                    {(() => {
                      const baseFee = formCourseId ? (courses.find(c => c.id === formCourseId)?.totalFee || 0) : 0;
                      return Math.max(0, baseFee - Number(formDiscount) - Number(formPaid)).toLocaleString();
                    })()}{" "}
                    PKR
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: counselor internal logs */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Counselor notes / internal Remarks</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Add special scholarship codes, installments intervals, or teacher recommendations..."
                className="w-full text-xs p-3 border border-slate-200 rounded-lg h-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Action Row */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdmitting(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-lg text-slate-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/10"
                id="btn-confirm-admission-submit"
              >
                Confirm Admission
              </button>
            </div>

          </form>
        </div>

      ) : (
        
        /* CASE 3: Students Registry Table Index */
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Section: Title and Search actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Institute Student Registry</h2>
              <p className="text-[11px] text-slate-400">Manage, search, archive and filter academic portfolios of all batches.</p>
            </div>
            
            <button
              onClick={() => setIsAdmitting(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/10 transition-colors flex items-center space-x-1.5 self-start md:self-auto"
              id="btn-admit-student-main"
            >
              <Plus className="w-4 h-4" />
              <span>New Admission</span>
            </button>
          </div>

          {/* Section: Search Filters bar */}
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-3">
            
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Name, Student ID, CNIC or phone number..."
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                  id="students-global-search"
                />
              </div>

              {/* Status filter */}
              <div className="w-full md:w-44">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none bg-slate-50/50"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Sub Filters row */}
            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-600">
              
              {/* Filter: Course */}
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 font-semibold font-mono uppercase text-[9px]">Course:</span>
                <select 
                  value={courseFilter} 
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="border-0 bg-transparent py-0.5 focus:ring-0 text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Programs</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <span className="text-slate-200">|</span>

              {/* Filter: Shift */}
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 font-semibold font-mono uppercase text-[9px]">Shift:</span>
                <select 
                  value={shiftFilter} 
                  onChange={(e) => setShiftFilter(e.target.value)}
                  className="border-0 bg-transparent py-0.5 focus:ring-0 text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Shifts</option>
                  <option value={Shift.Morning}>Morning</option>
                  <option value={Shift.Evening}>Evening</option>
                  <option value={Shift.Weekend}>Weekend</option>
                </select>
              </div>

            </div>

          </div>

          {/* Section: Students Table Grid */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            
            {filteredStudents.length === 0 ? (
              <div className="p-16 text-center text-slate-400 space-y-2">
                <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium">No student record matching the filters was found.</p>
                <button 
                  onClick={() => { setSearchTerm(""); setStatusFilter("all"); setCourseFilter("all"); setShiftFilter("all"); }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                      <th className="py-3 px-4">Student ID</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Academic Program</th>
                      <th className="py-3 px-4">Shift</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Owed Balance</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => {
                      const course = courses.find(c => c.id === student.courseId);
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/60 font-medium">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{student.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-bold text-slate-800">{student.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{student.phone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]" title={course?.name || "N/A"}>
                            {course ? course.name : "Unassigned"}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{student.shift}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase
                              ${student.status === StudentStatus.Active ? "bg-green-100 text-green-800" : ""}
                              ${student.status === StudentStatus.Completed ? "bg-blue-100 text-blue-800" : ""}
                              ${student.status === StudentStatus.Dropped ? "bg-red-100 text-red-800" : ""}
                              ${student.status === StudentStatus.OnHold ? "bg-amber-100 text-amber-800" : ""}
                            `}>
                              {student.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold">
                            {student.pendingAmount > 0 ? (
                              <span className="text-red-600 font-bold">{student.pendingAmount.toLocaleString()} PKR</span>
                            ) : (
                              <span className="text-emerald-600 font-bold">Paid</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              
                              <button
                                onClick={() => setSelectedStudentIdForProfile(student.id)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
                                title="View Student Hub Profile"
                                id={`view-btn-${student.id}`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setEditingStudent(student)}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 hover:text-blue-800 transition-colors"
                                title="Edit biographical ledger"
                                id={`edit-btn-${student.id}`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {currentUser.role === UserRole.Admin && (
                                <button
                                  onClick={() => handleDeleteStudent(student.id, student.name)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600 hover:text-red-800 transition-colors"
                                  title="Delete profile"
                                  id={`delete-btn-${student.id}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 4. MODAL FORM: Editing Student details */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-100" id="edit-student-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Edit Student Profile: {editingStudent.id}
              </h3>
              <button 
                onClick={() => setEditingStudent(null)} 
                className="text-xs font-semibold text-slate-400 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.fatherName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">CNIC</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.cnic}
                    onChange={(e) => setEditingStudent({ ...editingStudent, cnic: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Shift Selection</label>
                  <select
                    value={editingStudent.shift}
                    onChange={(e) => setEditingStudent({ ...editingStudent, shift: e.target.value as Shift })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value={Shift.Morning}>Morning</option>
                    <option value={Shift.Evening}>Evening</option>
                    <option value={Shift.Weekend}>Weekend</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Academic Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Base Program Fee (PKR)</label>
                  <input
                    type="number"
                    value={editingStudent.totalFee}
                    onChange={(e) => setEditingStudent({ ...editingStudent, totalFee: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Granted Discount (PKR)</label>
                  <input
                    type="number"
                    value={editingStudent.discount}
                    onChange={(e) => setEditingStudent({ ...editingStudent, discount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>

                {editingStudent.pendingAmount > 0 && (
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Next Installment Due Date</label>
                    <input
                      type="date"
                      value={editingStudent.nextInstallmentDate}
                      onChange={(e) => setEditingStudent({ ...editingStudent, nextInstallmentDate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded font-mono focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Internal Counselor Remarks</label>
                <textarea
                  value={editingStudent.notes}
                  onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded h-16 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-1.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
                  id="btn-edit-student-save"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {portalModal ? (
        <PortalCredentialsModal
          student={portalModal.student}
          portalAccount={portalModal.portalAccount}
          onClose={() => {
            setSelectedStudentIdForProfile(portalModal.student.id);
            setPortalModal(null);
          }}
          onPrintSlip={() => {
            setActivePrintStudent(portalModal.student);
            setPortalModal(null);
            setSelectedStudentIdForProfile(portalModal.student.id);
          }}
        />
      ) : null}

    </div>
  );
};
