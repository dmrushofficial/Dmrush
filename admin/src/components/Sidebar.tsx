import React from "react";
import { DMRushLogo } from "./DMRushLogo.js";
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, MessageSquare, CreditCard, 
  FileText, ShieldCheck, Settings as SettingsIcon, LogOut
} from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { UserRole } from "../types.js";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  mobileOpen, 
  setMobileOpen,
  onLogout,
}) => {
  const { currentUser, logout } = useApp();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: [UserRole.Admin, UserRole.Accountant] },
    { id: "students", label: "Students Portal", icon: Users, roles: [UserRole.Admin, UserRole.Accountant] },
    { id: "teachers", label: "Teachers", icon: GraduationCap, roles: [UserRole.Admin] },
    { id: "courses", label: "Courses & Batches", icon: BookOpen, roles: [UserRole.Admin, UserRole.Accountant] },
    { id: "inquiries", label: "Lead Manager (CRM)", icon: MessageSquare, roles: [UserRole.Admin, UserRole.Accountant] },
    { id: "accounts", label: "Accounts & Fees", icon: CreditCard, roles: [UserRole.Admin, UserRole.Accountant] },
    { id: "reports", label: "Analytical Reports", icon: FileText, roles: [UserRole.Admin, UserRole.Accountant] },
    { id: "logs", label: "Security Audit Logs", icon: ShieldCheck, roles: [UserRole.Admin] },
    { id: "settings", label: "System Settings", icon: SettingsIcon, roles: [UserRole.Admin] },
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1510] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#1a3324]
        lg:static lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      id="main-sidebar"
    >
      {/* Brand & Logo */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-[#1a3324] mb-4 bg-[#0d1510]">
          <DMRushLogo height="h-10" textColor="white" showTagline={true} />
        </div>

        {/* Navigation Menu Links */}
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            if (!currentUser || !item.roles.includes(currentUser.role)) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 text-left
                  ${isActive 
                    ? "bg-[#84cc16]/15 text-[#84cc16]" 
                    : "text-[#c5cebf] hover:bg-[#1a3324]/70 hover:text-white"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#84cc16]" : "text-[#8a9488]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Session Controls & Simulation Switches */}
      <div className="p-4 border-t border-[#1a3324] space-y-2 bg-[#0d1510]">
        {/* User Identity Details */}
        <div className="flex items-center gap-3 p-2 bg-[#1a3324]/60 rounded-lg border border-[#244530]">
          <div className="w-10 h-10 rounded-full bg-[#84cc16]/20 flex items-center justify-center text-[#84cc16] font-bold uppercase border-2 border-[#84cc16] shrink-0">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-white">{currentUser?.name || "User"}</p>
            <p className="text-xs text-[#8a9488] truncate font-mono">
              {currentUser?.email || ""}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          id="btn-logout"
          onClick={() => {
            if (onLogout) onLogout();
            else logout();
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-600/10 hover:bg-red-600/20 rounded-lg text-xs font-semibold text-red-400 transition-colors border border-red-500/20"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>Sign Out of Portal</span>
        </button>
      </div>
    </aside>
  );
};
