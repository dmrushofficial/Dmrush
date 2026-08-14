import React, { useState, useEffect } from "react";
import { Menu, Bell, Clock, User, LogOut, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext.js";

interface HeaderProps {
  activeTab: string;
  setMobileOpen: (open: boolean) => void;
  mobileOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setMobileOpen, 
  mobileOpen 
}) => {
  const { currentUser, students, inquiries } = useApp();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showAlerts, setShowAlerts] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      setCurrentTime(new Date().toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute live notifications / alert items
  const overdueStudents = students.filter(s => {
    if (!s.nextInstallmentDate || s.status === "Dropped" || s.status === "Completed") return false;
    const due = new Date(s.nextInstallmentDate);
    const today = new Date();
    return due < today && s.pendingAmount > 0;
  });

  const recentLeads = inquiries.filter(q => q.status === "New");

  const alertsCount = overdueStudents.length + recentLeads.length;

  const getBreadcrumbs = () => {
    switch (activeTab) {
      case "dashboard": return ["Main Workspace", "Control Dashboard"];
      case "students": return ["Student Registry", "Enrolled Profiles & Ledger"];
      case "teachers": return ["Faculty", "Teachers & Portal Logins"];
      case "courses": return ["Academic Catalog", "Courses & Active Batches"];
      case "inquiries": return ["Lead Management", "CRM Pipeline Nurturing"];
      case "accounts": return ["Financial Center", "Accounts Ledger & Billing"];
      case "reports": return ["Executive Board", "Analytical Exports"];
      case "logs": return ["Security Center", "Audit Log Ledger"];
      case "settings": return ["Console Configuration", "Institute Profile"];
      default: return ["Portal", "Overview"];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm no-print">
      {/* Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-none transition-colors"
          id="sidebar-toggle-btn"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>
        
        {/* Dynamic Breadcrumbs */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold font-sans">
          <span className="text-slate-400">{breadcrumbs[0]}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">{breadcrumbs[1]}</span>
        </div>
      </div>

      {/* Top Bar Right side items */}
      <div className="flex items-center space-x-6">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-full font-mono text-xs text-slate-600 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>{currentTime}</span>
        </div>

        {/* Notifications Alert Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors relative focus:outline-none"
            id="notifications-dropdown-toggle"
          >
            <Bell className="w-6 h-6" />
            {alertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
            )}
          </button>

          {/* Alert Dropdown Content */}
          {showAlerts && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-800">Operational Real-Time Alerts</h4>
                <span className="text-[10px] font-mono font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                  {alertsCount} Pending
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {overdueStudents.length === 0 && recentLeads.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active action items. All ledgers are balanced!
                  </div>
                ) : (
                  <>
                    {overdueStudents.map(student => (
                      <div key={student.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-800 font-semibold truncate">{student.name}</p>
                          <p className="text-[10px] text-red-500 font-mono mt-0.5 font-bold">
                            Installment Overdue: {student.pendingAmount.toLocaleString()} PKR
                          </p>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                            Due date was {student.nextInstallmentDate}
                          </p>
                        </div>
                      </div>
                    ))}

                    {recentLeads.map(lead => (
                      <div key={lead.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-800 font-semibold truncate">{lead.name}</p>
                          <p className="text-[10px] text-blue-500 font-mono mt-0.5 font-bold">
                            New Lead Query - Source: {lead.source}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                            Interested: Web / Mobile Application
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                <button 
                  onClick={() => setShowAlerts(false)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                >
                  Close Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Badge Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold uppercase border-2 border-orange-500">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800">{currentUser?.name || "User"}</p>
            <p className="text-[10px] text-slate-400 uppercase font-mono">{currentUser?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
