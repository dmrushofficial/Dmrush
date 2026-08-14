import React, { useState } from "react";
import { CheckCircle, Copy, Key, LogIn, Mail, X, AlertCircle } from "lucide-react";
import { apiFetch } from "../lib/api.js";
import { Student } from "../types.js";

export type PortalAccountInfo = {
  provisioned: boolean;
  created?: boolean;
  email?: string;
  initialPassword?: string;
  loginUrl?: string;
  courseName?: string;
  reason?: string;
};

const STORAGE_PREFIX = "dmrush_portal_";

export function savePortalCredentials(studentId: string, portal: PortalAccountInfo) {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${studentId}`, JSON.stringify(portal));
  } catch {
    // ignore quota errors
  }
}

export function loadPortalCredentials(studentId: string): PortalAccountInfo | null {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${studentId}`);
    return raw ? (JSON.parse(raw) as PortalAccountInfo) : null;
  } catch {
    return null;
  }
}

interface PortalCredentialsModalProps {
  student: Student;
  portalAccount?: PortalAccountInfo;
  onClose: () => void;
  onPrintSlip: () => void;
}

export const PortalCredentialsModal: React.FC<PortalCredentialsModalProps> = ({
  student,
  portalAccount,
  onClose,
  onPrintSlip,
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("Copy this value:", value);
    }
  };

  const loginUrl = process.env.LEARN_PUBLIC_URL || "http://localhost:3001/login";
  const loginUrlWithEmail = portalAccount?.email
    ? `${loginUrl}${loginUrl.includes("?") ? "&" : "?"}email=${encodeURIComponent(portalAccount.email)}`
    : loginUrl;
  const provisioned = portalAccount?.provisioned === true;

  const copyAll = () => {
    const lines = [
      `Student: ${student.name}`,
      `Student ID: ${student.id}`,
      provisioned
        ? [
            `Portal Email: ${portalAccount?.email || student.email}`,
            portalAccount?.initialPassword
              ? `Portal Password: ${portalAccount.initialPassword}`
              : "Portal Password: (existing account — unchanged)",
            `Login: ${loginUrlWithEmail}`,
            `Course: ${portalAccount?.courseName || ""}`,
          ].join("\n")
        : `Portal: Not created — ${portalAccount?.reason || "Unknown error"}`,
    ];
    void copyText("all", lines.join("\n"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="portal-credentials-title"
      >
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
              Admission successful
            </p>
            <h2 id="portal-credentials-title" className="text-lg font-bold text-slate-900 mt-1">
              {student.name}
            </h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{student.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {provisioned ? (
            <>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">Student portal account created</p>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Share these login details with the student. They can change the password from Profile
                    after signing in.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <CredentialRow
                  icon={Mail}
                  label="Portal email"
                  value={portalAccount?.email || student.email}
                  onCopy={() => void copyText("email", portalAccount?.email || student.email)}
                  copied={copied === "email"}
                />
                <CredentialRow
                  icon={Key}
                  label="Portal password"
                  value={
                    portalAccount?.initialPassword ||
                    "(Use Reset on student profile if unknown)"
                  }
                  hint="Format: DM + last 6 digits of student phone"
                  highlight={Boolean(portalAccount?.initialPassword)}
                  onCopy={
                    portalAccount?.initialPassword
                      ? () => void copyText("password", portalAccount.initialPassword!)
                      : undefined
                  }
                  copied={copied === "password"}
                />
                <CredentialRow
                  icon={LogIn}
                  label="Login URL"
                  value={loginUrlWithEmail}
                  onCopy={() => void copyText("url", loginUrlWithEmail)}
                  copied={copied === "url"}
                />
                {portalAccount?.courseName ? (
                  <p className="text-xs text-slate-600 px-1">
                    Enrolled course: <strong>{portalAccount.courseName}</strong>
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Portal account not created</p>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {portalAccount?.reason ||
                    "Learn server may be offline. Start Learn on port 3001 and edit/save the student again."}
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  Student was saved in admin — only the online portal login is missing.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 p-5 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied === "all" ? "Copied!" : "Copy all details"}
          </button>
          <button
            type="button"
            onClick={onPrintSlip}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg"
          >
            Print admission slip
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg ml-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

function CredentialRow({
  icon: Icon,
  label,
  value,
  hint,
  highlight,
  onCopy,
  copied,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 font-mono">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
      {hint ? <p className="text-[10px] text-slate-500 mb-1">{hint}</p> : null}
      <p
        className={`text-sm break-all ${
          highlight ? "font-mono font-bold text-lg text-slate-900 tracking-wide" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface PortalCredentialsCardProps {
  studentId: string;
  studentEmail?: string;
  onReset?: (portal: PortalAccountInfo) => void;
}

export const PortalCredentialsCard: React.FC<PortalCredentialsCardProps> = ({
  studentId,
  studentEmail,
  onReset,
}) => {
  const portal = loadPortalCredentials(studentId);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      const res = await apiFetch(`/students/${studentId}/portal-reset-password`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success && data.portalAccount) {
        savePortalCredentials(studentId, data.portalAccount);
        onReset?.({ ...data.portalAccount, provisioned: true });
      } else {
        alert(data.message || "Could not reset portal password. Is Learn running on port 3001?");
      }
    } catch {
      alert("Could not reach admin server.");
    } finally {
      setResetting(false);
    }
  };

  if (portal?.provisioned && portal.initialPassword) {
    return (
      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/80 space-y-2">
        <p className="text-xs font-bold uppercase text-emerald-800 font-mono flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5" />
          Student portal login (this session)
        </p>
        <p className="text-xs text-emerald-900">
          Email: <span className="font-mono font-semibold">{portal.email}</span>
        </p>
        <p className="text-xs text-emerald-900">
          Password: <span className="font-mono font-bold text-base">{portal.initialPassword}</span>
        </p>
        <p className="text-xs text-emerald-800">
          Login:{" "}
          <a href={portal.loginUrl} className="underline font-semibold" target="_blank" rel="noreferrer">
            {portal.loginUrl}
          </a>
        </p>
        <p className="text-[10px] text-emerald-700">
          Not the admin login. Use this email on http://localhost:3001/login
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
      <p className="text-xs font-bold uppercase text-slate-600 font-mono">Student portal login</p>
      <p className="text-xs text-slate-600">
        {studentEmail
          ? `Portal email on file: ${studentEmail}. Password = DM + last 6 phone digits.`
          : "Add an email on admission to create portal access."}
      </p>
      <button
        type="button"
        onClick={handleReset}
        disabled={resetting}
        className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:opacity-50"
      >
        {resetting ? "Loading…" : "Show / reset portal password"}
      </button>
    </div>
  );
};
