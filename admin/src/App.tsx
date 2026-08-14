import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext.js";
import { Sidebar } from "./components/Sidebar.js";
import { Header } from "./components/Header.js";
import { DashboardView } from "./components/DashboardView.js";
import { StudentsView } from "./components/StudentsView.js";
import { TeachersView } from "./components/TeachersView.js";
import { CoursesView } from "./components/CoursesView.js";
import { InquiriesView } from "./components/InquiriesView.js";
import { AccountsView } from "./components/AccountsView.js";
import { ReportsView } from "./components/ReportsView.js";
import { SettingsView } from "./components/SettingsView.js";
import { LoginView } from "./components/LoginView.js";
import { AdmissionPrintSlip } from "./components/AdmissionPrintSlip.js";
import { StudentFeesSlip } from "./components/StudentFeesSlip.js";
import { Student } from "./types.js";

const AdminShell: React.FC = () => {
  const { currentUser, activePrintStudent, setActivePrintStudent, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [paymentModalStudent, setPaymentModalStudent] = useState<Student | null>(null);
  const [activePrintFeeStudent, setActivePrintFeeStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!currentUser && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
    if (currentUser && location.pathname === "/login") {
      navigate("/", { replace: true });
    }
  }, [currentUser, location.pathname, navigate]);

  const handleFeeCollectAction = (student: Student) => {
    setPaymentModalStudent(student);
    setActiveTab("accounts");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            setActiveTab={setActiveTab}
            setSelectedStudentIdForProfile={setSelectedStudentId}
          />
        );
      case "students":
        return (
          <StudentsView
            selectedStudentIdForProfile={selectedStudentId}
            setSelectedStudentIdForProfile={setSelectedStudentId}
            openPaymentModalWithStudent={handleFeeCollectAction}
            onPrintFeeSlip={setActivePrintFeeStudent}
          />
        );
      case "teachers":
        return <TeachersView />;
      case "courses":
        return <CoursesView />;
      case "inquiries":
        return <InquiriesView />;
      case "accounts":
        return (
          <AccountsView
            paymentModalStudent={paymentModalStudent}
            setPaymentModalStudent={setPaymentModalStudent}
          />
        );
      case "reports":
        return <ReportsView />;
      case "logs":
        return <SettingsView defaultTab="logs" key="logs-tab-view" />;
      case "settings":
        return <SettingsView defaultTab="profile" key="settings-tab-view" />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <>
      <div
        className="flex min-h-screen bg-[#f7f8f5] font-sans antialiased text-[#0a0a0a]"
        id="portal-app-root"
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            activeTab={activeTab}
            setMobileOpen={setMobileSidebarOpen}
            mobileOpen={mobileSidebarOpen}
          />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {activePrintStudent && (
        <AdmissionPrintSlip
          student={activePrintStudent}
          onClose={() => setActivePrintStudent(null)}
        />
      )}

      {activePrintFeeStudent && (
        <StudentFeesSlip
          student={activePrintFeeStudent}
          onClose={() => setActivePrintFeeStudent(null)}
        />
      )}
    </>
  );
};

const LoginRoute: React.FC = () => {
  const { currentUser, isLoading } = useApp();
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1510] text-white space-y-4">
        <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-sm font-bold tracking-widest uppercase font-mono text-[#84cc16]">
            DM Rush Portal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Booting secure financial ledger & registries database...
          </p>
        </div>
      </div>
    );
  }
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return <LoginView />;
};

const ProtectedRoute: React.FC = () => {
  const { currentUser, isLoading } = useApp();
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1510] text-white space-y-4">
        <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-sm font-bold tracking-widest uppercase font-mono text-[#84cc16]">
            DM Rush Portal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Booting secure financial ledger & registries database...
          </p>
        </div>
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <AdminShell />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginRoute />} />
    <Route path="/*" element={<ProtectedRoute />} />
  </Routes>
);

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/admin">
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
