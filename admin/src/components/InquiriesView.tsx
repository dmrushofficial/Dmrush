import React, { useState } from "react";
import { 
  Plus, Edit3, Trash2, Calendar, Phone, Mail, FileText, CheckCircle, ArrowRight, UserPlus, 
  MapPin, RefreshCw, Star, AlertCircle, Share2
} from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { Inquiry, LeadSource, LeadStatus, Shift } from "../types.js";

export const InquiriesView: React.FC = () => {
  const { 
    inquiries, courses, addInquiry, updateInquiry, deleteInquiry, convertInquiryToStudent, currentUser 
  } = useApp();

  // Navigation states
  const [isAddingLead, setIsAddingLead] = useState<boolean>(false);
  const [editingLead, setEditingLead] = useState<Inquiry | null>(null);
  const [convertingLead, setConvertingLead] = useState<Inquiry | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Form: Adding lead
  const [leadName, setLeadName] = useState<string>("");
  const [leadPhone, setLeadPhone] = useState<string>("");
  const [leadEmail, setLeadEmail] = useState<string>("");
  const [leadCourseId, setLeadCourseId] = useState<string>("");
  const [leadSource, setLeadSource] = useState<LeadSource>(LeadSource.Facebook);
  const [leadNotes, setLeadNotes] = useState<string>("");
  const [leadFollowUp, setLeadFollowUp] = useState<string>("");

  // Conversion wizard options
  const [conversionShift, setConversionShift] = useState<Shift>(Shift.Morning);
  const [conversionNotes, setConversionNotes] = useState<string>("");

  // Submit Lead
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadCourseId) {
      alert("Name, phone, and interested course are required.");
      return;
    }

    const payload: Partial<Inquiry> = {
      name: leadName,
      phone: leadPhone,
      email: leadEmail,
      interestedCourseId: leadCourseId,
      source: leadSource,
      notes: leadNotes,
      followUpDate: leadFollowUp || new Date().toISOString().split("T")[0],
      status: LeadStatus.New
    };

    const ok = await addInquiry(payload);
    if (ok) {
      alert("New client inquiry registered successfully.");
      setIsAddingLead(false);
      resetLeadForm();
    } else {
      alert("Database failed to process lead registration.");
    }
  };

  // Submit Edit Lead
  const handleLeadEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    const ok = await updateInquiry(editingLead.id, {
      name: editingLead.name,
      phone: editingLead.phone,
      email: editingLead.email,
      interestedCourseId: editingLead.interestedCourseId,
      source: editingLead.source,
      notes: editingLead.notes,
      followUpDate: editingLead.followUpDate,
      status: editingLead.status
    });

    if (ok) {
      alert("Lead profile updated successfully.");
      setEditingLead(null);
    } else {
      alert("Database rejected lead modifications.");
    }
  };

  // Perform one-click conversion
  const handleConvertConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;

    const ok = await convertInquiryToStudent(
      convertingLead.id,
      convertingLead.interestedCourseId,
      conversionShift,
      conversionNotes
    );

    if (ok) {
      alert(`CONVERSION SUCCESSFUL! ${convertingLead.name} has been enrolled in classes. A tuition ledger was initialized automatically.`);
      setConvertingLead(null);
      setConversionNotes("");
    } else {
      alert("Lead conversion failed. Check active batches for assigned course.");
    }
  };

  // Purge lead
  const handleDeleteLead = async (id: string, name: string) => {
    if (window.confirm(`Permanently purge CRM file for lead: ${name}?`)) {
      const ok = await deleteInquiry(id);
      if (ok) {
        alert("Lead record deleted.");
      }
    }
  };

  const resetLeadForm = () => {
    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setLeadCourseId("");
    setLeadSource(LeadSource.Facebook);
    setLeadNotes("");
    setLeadFollowUp("");
  };

  // Filtering
  const filteredLeads = inquiries.filter(lead => {
    const statMatch = statusFilter === "all" || lead.status === statusFilter;
    const srcMatch = sourceFilter === "all" || lead.source === sourceFilter;
    return statMatch && srcMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="inquiries-view-root">
      
      {/* 1. Header & Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">CRM Lead & Campaign Manager</h2>
          <p className="text-[11px] text-slate-400">Capture course inquiries, track counselor callbacks and convert warm leads to students in one-click.</p>
        </div>
        <button
          onClick={() => setIsAddingLead(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/10 flex items-center space-x-1.5 self-start sm:self-auto"
          id="btn-add-lead-main"
        >
          <Plus className="w-4 h-4" />
          <span>Capture Lead Inquiry</span>
        </button>
      </div>

      {/* 2. Filters Row */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
        <div className="flex flex-wrap gap-4 items-center w-full">
          
          {/* Filter Status */}
          <div className="space-y-1 w-full sm:w-44">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Lead Stage Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded bg-slate-50/50 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="New">New / Uncontacted</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested / Hot</option>
              <option value="Follow-up">Awaiting Follow-up</option>
              <option value="Converted">Converted Admissions</option>
              <option value="Closed">Closed / Dropped Lead</option>
            </select>
          </div>

          {/* Filter Source */}
          <div className="space-y-1 w-full sm:w-44">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Campaign Channel Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded bg-slate-50/50 focus:outline-none"
            >
              <option value="all">All Channels</option>
              <option value="Facebook">Facebook Ads</option>
              <option value="Instagram">Instagram Campaign</option>
              <option value="Walk-in">Walk-in Visits</option>
              <option value="Referral">Alumni Referral</option>
              <option value="WhatsApp">WhatsApp Inquiry</option>
              <option value="Website">Website Form</option>
            </select>
          </div>

        </div>

        <div className="flex space-x-2 shrink-0">
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
            {filteredLeads.length} Lead Records
          </span>
        </div>
      </div>

      {/* 3. CRM Lead list table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-300 animate-bounce" />
            <p className="text-xs font-semibold">No warm lead records match your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Program Interest</th>
                  <th className="py-3 px-4">Campaign Source</th>
                  <th className="py-3 px-4">Callbacks & Follow-ups</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLeads.map(lead => {
                  const course = courses.find(c => c.id === lead.interestedCourseId);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/60">
                      
                      {/* Name & Contact Info */}
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold text-slate-800">{lead.name}</p>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span className="flex items-center"><Phone className="w-3 h-3 mr-0.5" /> {lead.phone}</span>
                            {lead.email && <span className="flex items-center"><Mail className="w-3 h-3 mr-0.5" /> {lead.email}</span>}
                          </div>
                        </div>
                      </td>

                      {/* Course program */}
                      <td className="py-3 px-4 text-slate-700">
                        {course ? (
                          <div>
                            <p className="font-semibold">{course.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{course.duration} Tuition</p>
                          </div>
                        ) : "N/A"}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-mono">
                          {lead.source}
                        </span>
                      </td>

                      {/* Notes & Follow up date */}
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <p className="text-slate-600 line-clamp-1 italic text-[11px]" title={lead.notes}>
                            "{lead.notes || "No notes logged."}"
                          </p>
                          <p className="text-[10px] text-amber-600 font-semibold mt-0.5 flex items-center">
                            <Calendar className="w-3 h-3 mr-0.5 shrink-0" /> Call on: {lead.followUpDate}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
                          ${lead.status === LeadStatus.New ? "bg-slate-100 text-slate-800" : ""}
                          ${lead.status === LeadStatus.Contacted ? "bg-blue-100 text-blue-800" : ""}
                          ${lead.status === LeadStatus.Interested ? "bg-amber-100 text-amber-800" : ""}
                          ${lead.status === LeadStatus.FollowUp ? "bg-indigo-100 text-indigo-800" : ""}
                          ${lead.status === LeadStatus.Converted ? "bg-green-100 text-green-800" : ""}
                          ${lead.status === LeadStatus.Closed ? "bg-red-100 text-red-800" : ""}
                        `}>
                          {lead.status}
                        </span>
                      </td>

                      {/* Conversions wizard trigger */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {lead.status !== LeadStatus.Converted && (
                            <button
                              onClick={() => {
                                setConvertingLead(lead);
                                setConversionNotes(lead.notes);
                              }}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white font-bold text-[10px] rounded flex items-center space-x-1 shadow-sm"
                              title="Convert lead to regular student"
                              id={`convert-btn-${lead.id}`}
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Enroll</span>
                            </button>
                          )}

                          <button
                            onClick={() => setEditingLead(lead)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                            title="Edit notes"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="p-1 bg-red-50 hover:bg-red-100 rounded text-red-500"
                            title="Purge record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* 4. MODAL: Capture Lead */}
      {isAddingLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="add-lead-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Capture Client Inquiry Lead</h3>
              <button onClick={() => setIsAddingLead(false)} className="text-slate-400 hover:text-slate-800 text-xs font-semibold">Close</button>
            </div>
            <form onSubmit={handleLeadSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Lead Full Name *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Usman Ghani"
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp Phone *</label>
                  <input
                    type="text"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="0300-XXXXXXX"
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Interested Program *</label>
                  <select
                    required
                    value={leadCourseId}
                    onChange={(e) => setLeadCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Campaign Channel *</label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value={LeadSource.Facebook}>Facebook Ads</option>
                    <option value={LeadSource.Instagram}>Instagram</option>
                    <option value={LeadSource.WalkIn}>Walk-In campus</option>
                    <option value={LeadSource.Referral}>Alumni Referral</option>
                    <option value={LeadSource.WhatsApp}>WhatsApp Campaign</option>
                    <option value={LeadSource.Website}>Website Portal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Counselor Notes</label>
                <textarea
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Inquired about scholarship schemes, installment extensions or free trials..."
                  className="w-full p-2.5 border border-slate-200 rounded h-16 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Awaiting Follow-up Date</label>
                <input
                  type="date"
                  value={leadFollowUp}
                  onChange={(e) => setLeadFollowUp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-1.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingLead(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
                  id="btn-confirm-add-lead"
                >
                  Confirm Lead
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Edit Lead */}
      {editingLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="edit-lead-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Configure Callback notes</h3>
              <button onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-slate-800 text-xs font-semibold">Close</button>
            </div>
            <form onSubmit={handleLeadEditSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Lead Name</label>
                <input
                  type="text"
                  required
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                  <input
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Program Interest</label>
                  <select
                    value={editingLead.interestedCourseId}
                    onChange={(e) => setEditingLead({ ...editingLead, interestedCourseId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Inquiry status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Counselor remarks</label>
                <textarea
                  value={editingLead.notes}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded h-16 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Scheduled Callback date</label>
                <input
                  type="date"
                  value={editingLead.followUpDate}
                  onChange={(e) => setEditingLead({ ...editingLead, followUpDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-1.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
                  id="btn-edit-lead-confirm"
                >
                  Save Modifications
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. CONVERSION WIZARD MODAL */}
      {convertingLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="conversion-wizard-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Lead Conversion Wizard</h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Enroll <span className="font-bold text-slate-700">{convertingLead.name}</span> in course and generate tuition ledger immediately.
              </p>
            </div>
            
            <form onSubmit={handleConvertConfirm} className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Academic Class Shift *</label>
                <select
                  value={conversionShift}
                  onChange={(e) => setConversionShift(e.target.value as Shift)}
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                >
                  <option value={Shift.Morning}>Morning Shift</option>
                  <option value={Shift.Evening}>Evening Shift</option>
                  <option value={Shift.Weekend}>Weekend Shift</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Conversion internal comments</label>
                <textarea
                  value={conversionNotes}
                  onChange={(e) => setConversionNotes(e.target.value)}
                  placeholder="Granted special zero down-payment schemes, or assigned reference coupon tracking..."
                  className="w-full p-2.5 border border-slate-200 rounded h-16 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-1.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConvertingLead(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded flex items-center space-x-1"
                  id="btn-confirm-lead-conversion"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Authorize Admission</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
