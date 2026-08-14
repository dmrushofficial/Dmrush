import React, { useState } from "react";
import { 
  Settings, Building, FileText, Users, ShieldAlert, History, Save, RefreshCw, Trash2, 
  CheckCircle, Database, AlertCircle, Key, Lock, Globe
} from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { UserRole } from "../types.js";

interface SettingsViewProps {
  defaultTab?: "profile" | "receipt" | "users" | "logs";
}

export const SettingsView: React.FC<SettingsViewProps> = ({ defaultTab = "profile" }) => {
  const { 
    settings, updateSettings, logs, currentUser, resetDatabase, users, updateUserCredentials 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"profile" | "receipt" | "users" | "logs">(defaultTab);

  // Profile Form States
  const [instName, setInstName] = useState<string>(settings?.instituteName || "");
  const [instAddress, setInstAddress] = useState<string>(settings?.address || "");
  const [instPhone, setInstPhone] = useState<string>(settings?.phone || "");
  const [instEmail, setInstEmail] = useState<string>(settings?.email || "");

  // Receipt Form States
  const [receiptNote, setReceiptNote] = useState<string>(settings?.receiptNote || "");
  const [waTemplate, setWaTemplate] = useState<string>(
    "Dear Student, your payment has been processed successfully. Thank you for choosing DM Rush."
  );

  // Submit General Settings
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateSettings({
      instituteName: instName,
      address: instAddress,
      phone: instPhone,
      email: instEmail
    });
    if (ok) {
      alert("Institute profile updated successfully.");
    } else {
      alert("Database error updating configurations.");
    }
  };

  // Submit Receipt Settings
  const handleSaveReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateSettings({
      receiptNote: receiptNote
    });
    if (ok) {
      alert("Receipt customization parameters saved.");
    } else {
      alert("Database rejected receipt modifications.");
    }
  };

  // Trigger Database Factory Reset
  const handleFactoryReset = async () => {
    if (currentUser?.role !== UserRole.Admin) {
      alert("RESTRICTED: Only administrators can authorize a factory ledger reset.");
      return;
    }
    const doubleConfirm = window.confirm(
      "CRITICAL DIAGNOSTIC WARNING:\nThis will permanently purge all custom enrollments, course modifications, CRM leads and payment receipts, reverting the database to pristine factory demo records.\n\nDo you want to proceed?"
    );
    if (doubleConfirm) {
      const ok = await resetDatabase();
      if (ok) {
        alert("DATABASE FACTORY RESET COMPLETED.\nRebooting application state providers...");
        window.location.reload();
      } else {
        alert("DB server refused factory wipe command.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="settings-view-root">
      
      {/* 1. Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">System configuration & Diagnostics</h2>
        <p className="text-[11px] text-slate-400">Configure receipt disclaimers, inspect cashier user directories, and monitor real-time database activity logs.</p>
      </div>

      {/* 2. Content Bento Grid with Sidebar Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Navigation Links */}
        <div className="space-y-1.5 lg:col-span-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition-all
              ${activeTab === "profile" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            <Building className="w-4 h-4 shrink-0" />
            <span>Institute Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("receipt")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition-all
              ${activeTab === "receipt" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Receipt Customization</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition-all
              ${activeTab === "users" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Staff Directory</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition-all
              ${activeTab === "logs" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >
            <History className="w-4 h-4 shrink-0" />
            <span>Activity logs Audit</span>
          </button>
        </div>

        {/* Right Side: Active Configuration Form */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-96">
          
          {/* TAB 1: Profile Information */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Institute Details</h3>
                <p className="text-[10px] text-slate-400 mt-1">Provide legal name and contact details displayed on issued invoices and WhatsApp bills.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Institute Name</label>
                    <input
                      type="text"
                      required
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Authorized Phone</label>
                    <input
                      type="text"
                      required
                      value={instPhone}
                      onChange={(e) => setInstPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Billing Email</label>
                    <input
                      type="email"
                      required
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Legal Street Address</label>
                    <input
                      type="text"
                      required
                      value={instAddress}
                      onChange={(e) => setInstAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Receipt Note & Layouts */}
          {activeTab === "receipt" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Invoice Disclaimers & Messages</h3>
                <p className="text-[10px] text-slate-400 mt-1">Configure legal refund policies printed on thermal billing receipts.</p>
              </div>

              <form onSubmit={handleSaveReceipt} className="space-y-4 text-xs font-medium">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Receipt Footer Note (Disclaimer)</label>
                  <textarea
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none font-sans"
                    placeholder="e.g. Fees once paid are non-refundable and non-transferable."
                  />
                  <span className="text-[9px] text-slate-400 block">Note: This is automatically printed at the base of physical receipts.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp Notification Tagline</label>
                  <input
                    type="text"
                    value={waTemplate}
                    onChange={(e) => setWaTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Receipt Layouts</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Staff & Accountant Directory */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Cashier & Accountant Profiles</h3>
                <p className="text-[10px] text-slate-400 mt-1">Inspect and manage active administrative logins assigned to cashier tasks.</p>
              </div>

              <div className="space-y-4">
                {users.map((user) => {
                  const isAdmin = user.role === UserRole.Admin;
                  const isCurrentUser = currentUser?.id === user.id;
                  return (
                    <div key={user.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${isAdmin ? "bg-blue-600" : "bg-emerald-600"} text-white flex items-center justify-center font-bold text-sm font-mono rounded-lg shadow-sm`}>
                            {isAdmin ? "AD" : "AC"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                              <span>{user.name}</span>
                              {isCurrentUser && (
                                <span className="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">You</span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Role: {user.role.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Display current email (password never shown) */}
                      <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">Registered Email</span>
                          <span className="font-mono text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-md block border border-slate-200 truncate">{user.email}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">Secret Password Pin</span>
                          <span className="font-mono text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-md block border border-slate-200 truncate">
                            ••••••••
                          </span>
                        </div>
                      </div>

                      {/* Admin form to edit credentials */}
                      {currentUser?.role === UserRole.Admin && (
                        <div className="pt-3 border-t border-slate-200/60">
                          <UserCredentialForm user={user} onUpdate={updateUserCredentials} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Security diagnostic box */}
              {currentUser.role === UserRole.Admin && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3 pt-4 mt-6">
                  <div className="flex items-center space-x-2 text-red-600">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Administrative Diagnostics Zone</h4>
                  </div>
                  <p className="text-[10px] text-red-700 leading-relaxed font-sans font-medium">
                    Resetting the system database permanently wipes all active enrollments, leads, payments, and receipt logs, returning the site to the original set of dummy records. This operation cannot be reversed.
                  </p>
                  <button
                    onClick={handleFactoryReset}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded flex items-center space-x-1 shadow-sm"
                    id="btn-factory-reset-db"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revert to Factory Mock Data</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: Activity Log Trail */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">System Activity Trail</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Chronological record of transactions, logins, and schema updates.</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded">
                  {logs.length} Log entries
                </span>
              </div>

              <div className="overflow-y-auto max-h-96 pr-2 space-y-2">
                {logs.slice().reverse().map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between items-start">
                    <div className="space-y-1 pr-4">
                      <p className="font-bold text-slate-800 leading-none">{log.action}</p>
                      <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{log.details}</p>
                      <p className="text-[9px] text-blue-500 font-mono">User: {log.user}</p>
                    </div>
                    <div className="text-right shrink-0 text-[10px] font-mono text-slate-400">
                      <p>{log.date}</p>
                      <p className="mt-0.5">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

interface UserCredentialFormProps {
  user: any;
  onUpdate: (id: string, email: string, password?: string, name?: string) => Promise<boolean>;
}

const UserCredentialForm: React.FC<UserCredentialFormProps> = ({ user, onUpdate }) => {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    const ok = await onUpdate(user.id, email, password || undefined, name);
    setIsSaving(false);
    if (ok) {
      setSuccess(true);
      setPassword("");
      setTimeout(() => setSuccess(false), 4000);
    } else {
      alert("Failed to save credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 bg-white border border-slate-200/60 p-4 rounded-xl shadow-inner mt-2">
      <div className="flex items-center space-x-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider font-mono">
        <Key className="w-3.5 h-3.5" />
        <span>Modify Login Credentials</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Profile Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">New Password (optional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
            autoComplete="new-password"
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800 font-mono font-bold"
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        {success ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1.5 animate-in fade-in duration-150">
            <CheckCircle className="w-4 h-4" />
            <span>Profile and authentication credentials updated successfully!</span>
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono">Changes take effect immediately upon saving.</span>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Credentials"}</span>
        </button>
      </div>
    </form>
  );
};
