import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { DMRushLogo } from "./DMRushLogo.js";

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1510] flex flex-col items-center justify-center p-4 relative overflow-hidden" id="login-view-container">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#84cc16]/15 rounded-full blur-3xl -ml-20 -mt-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1a3324]/80 rounded-full blur-3xl -mr-20 -mb-20"></div>

      <div className="w-full max-w-md bg-[#1a3324] border border-[#244530] rounded-2xl shadow-2xl p-8 space-y-6 z-10 relative">
        
        {/* Logo / Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center py-2">
            <DMRushLogo height="h-12" textColor="white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">DM Rush Institute</h1>
            <p className="text-xs text-slate-400">Administrative Control & Ledger Workspace</p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Workspace Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-2 bg-[#0d1510] border border-[#244530] text-white rounded-lg text-xs font-medium focus:outline-none focus:border-[#84cc16] transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 bg-[#0d1510] border border-[#244530] text-white rounded-lg text-xs font-medium focus:outline-none focus:border-[#84cc16] transition-colors placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#84cc16] hover:bg-[#65a30d] disabled:bg-[#4d7c0f] text-[#0d1510] text-xs font-bold rounded-lg shadow-lg shadow-[#84cc16]/20 transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-[#0d1510]/30 border-t-[#0d1510] rounded-full animate-spin"></span>
            ) : (
              <span>Sign in to Workspace</span>
            )}
          </button>
        </form>
      </div>

      <p className="text-[10px] text-slate-600 mt-6 font-mono">
        Authorized personnel access only. Ledger actions are audited and timestamped.
      </p>
    </div>
  );
};
