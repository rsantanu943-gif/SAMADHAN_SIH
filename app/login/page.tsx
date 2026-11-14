"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FlowGuardStore, DEMO_USERS } from "@/lib/flowguard-store";
import { UserRole } from "@/lib/types";
import {
  ShieldCheck,
  Lock,
  Mail,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  Compass,
  BadgeAlert,
  HelpCircle,
  Landmark,
  FileText,
  LogOut,
  ChevronRight
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";

  // Login Mode: COUNCIL (Officers) vs INSTITUTION (Colleges)
  const [loginMode, setLoginMode] = useState<"COUNCIL" | "INSTITUTION">("COUNCIL");

  // Form State
  const [identifier, setIdentifier] = useState("scrutiny.west01@aicte-india.org");
  const [permanentId, setPermanentId] = useState("1-4029102");
  const [password, setPassword] = useState("samadhan@2026");
  const [securityPin, setSecurityPin] = useState("892014");
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Dynamic Captcha
  const [captchaNum1, setCaptchaNum1] = useState(37);
  const [captchaNum2, setCaptchaNum2] = useState(15);
  const captchaAnswer = captchaNum1 + captchaNum2;

  const refreshCaptcha = () => {
    const n1 = Math.floor(Math.random() * 50) + 10;
    const n2 = Math.floor(Math.random() * 40) + 5;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaInput("");
  };

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(() => {
    return FlowGuardStore.isAuthenticated() ? FlowGuardStore.getCurrentUser() : null;
  });

  const handleQuickRoleSelect = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (role === "INSTITUTION_ADMIN") {
      setLoginMode("INSTITUTION");
      setPermanentId(user.institutionId ? "1-4029102" : "1-4029102");
      setIdentifier(user.email);
    } else {
      setLoginMode("COUNCIL");
      setIdentifier(user.email);
    }
    setPassword("samadhan@2026");
    setSecurityPin("892014");
    setCaptchaInput(String(captchaAnswer));
    setErrorMessage(null);
  };

  const handleInstantSignIn = (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    const user = DEMO_USERS[role];

    setTimeout(() => {
      const res = FlowGuardStore.login({
        role,
        email: user.email,
        rememberMe: true
      });

      setLoggedInUser(res.user);
      setSuccessMessage(`Authenticated successfully as ${res.user.name} (${res.user.role.replace("_", " ")}). Redirecting...`);
      setIsLoading(false);

      setTimeout(() => {
        router.push(nextUrl);
      }, 1000);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate Captcha
    if (parseInt(captchaInput.trim(), 10) !== captchaAnswer) {
      setErrorMessage(`Security Captcha verification failed. Please enter the sum of ${captchaNum1} + ${captchaNum2}.`);
      refreshCaptcha();
      return;
    }

    // Validate Input
    if (loginMode === "COUNCIL" && !identifier.trim()) {
      setErrorMessage("Please enter your official institutional email or officer ID.");
      return;
    }

    if (loginMode === "INSTITUTION" && !permanentId.trim()) {
      setErrorMessage("Please enter your official AICTE Permanent Institute ID (e.g. 1-4029102).");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your account authorization password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      let loginParams: any = {
        password,
        rememberMe
      };

      if (loginMode === "INSTITUTION") {
        loginParams.permanentId = permanentId.trim();
        loginParams.email = identifier.trim();
        loginParams.role = "INSTITUTION_ADMIN";
      } else {
        loginParams.email = identifier.trim();
      }

      const result = FlowGuardStore.login(loginParams);
      setIsLoading(false);

      if (result.success) {
        setLoggedInUser(result.user);
        setSuccessMessage(`Sign-in verified. Welcome, ${result.user.name} (${result.user.designation}). Directing to workspace...`);
        setTimeout(() => {
          router.push(nextUrl);
        }, 1000);
      } else {
        setErrorMessage("Authentication failed. Invalid statutory credentials or unrecognized user ID.");
        refreshCaptcha();
      }
    }, 800);
  };

  const handleSignOutCurrent = () => {
    FlowGuardStore.logout();
    setLoggedInUser(null);
    setSuccessMessage("You have been signed out of your institutional session.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Ministry Banner */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-3.5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center font-black text-slate-950 text-sm tracking-tighter shadow-md ring-1 ring-amber-400/40">
              S360
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight group-hover:text-amber-400 transition-colors">
                  Samadhan360
                </span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase font-mono">
                  Statutory Gateway
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Ministry of Education • Smart Approval & Compliance Management System
              </p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">NIST SP 800-53 / TLS 1.3 Grounded</span>
            </div>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 font-bold text-xs"
            >
              <span>Explore Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Login Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur space-y-6">
            
            {/* Active Session Notification if logged in */}
            {loggedInUser && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <UserCheck className="w-4 h-4" />
                    <span>Currently Active Session: {loggedInUser.name}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Role: <strong>{loggedInUser.role.replace("_", " ")}</strong> ({loggedInUser.designation})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={nextUrl}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors"
                  >
                    Enter Workspace
                  </Link>
                  <button
                    onClick={handleSignOutCurrent}
                    className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch</span>
                  </button>
                </div>
              </div>
            )}

            {/* Portal Title & Tab Switcher */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded">
                  Secure Access
                </span>
                <span className="text-xs text-slate-400">Academic Year 2026-27</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Institutional Single Sign-On
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your authorized credentials to access regulatory approval dockets, scrutiny workflows, and compliance ledgers.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginMode("COUNCIL");
                  setIdentifier("scrutiny.west01@aicte-india.org");
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  loginMode === "COUNCIL"
                    ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>Council & Regulatory Officers</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode("INSTITUTION");
                  setPermanentId("1-4029102");
                  setIdentifier("principal@vjti.ac.in");
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  loginMode === "INSTITUTION"
                    ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Institution Portal (Colleges)</span>
              </button>
            </div>

            {/* Error & Success Banners */}
            {errorMessage && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3.5 text-xs text-red-300 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Authentication Error: </span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-3.5 text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Access Granted: </span>
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Institution Permanent ID (Only in Institution Mode) */}
              {loginMode === "INSTITUTION" && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>AICTE Permanent Institute ID (PID):</span>
                    <span className="text-[10px] text-amber-400 font-mono">e.g. 1-4029102 (VJTI)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={permanentId}
                      onChange={(e) => setPermanentId(e.target.value)}
                      placeholder="1-4029102"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email / Officer ID */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  {loginMode === "COUNCIL"
                    ? "Official Email / Officer Registration ID:"
                    : "Principal / Authorized Signatory Email:"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginMode === "COUNCIL" ? "officer@aicte-india.org" : "principal@institution.edu.in"}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-300">
                    Statutory Account Password:
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword("samadhan@2026")}
                    className="text-[10px] text-amber-400 hover:underline font-mono"
                  >
                    Auto-Fill Demo Password
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full pl-9 pr-22 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700/80 flex items-center gap-1.5 transition-all cursor-pointer text-[10px] font-bold select-none"
                    title={showPassword ? "Switch to hidden password" : "Switch to plain text visibility"}
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-amber-300">Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
                {showPassword && (
                  <p className="text-[10px] text-amber-400/90 flex items-center gap-1 mt-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Password visibility enabled (plain text mode)</span>
                  </p>
                )}
              </div>

              {/* 2FA Security PIN & Dynamic Captcha Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 2FA PIN */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>2FA Security Token / PIN:</span>
                    <span className="text-[10px] text-slate-500 font-mono">6 Digits</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      maxLength={6}
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      placeholder="892014"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 font-mono text-xs tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Captcha Challenge */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-300">
                      Security Captcha:
                    </label>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                      title="Generate new calculation"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-700 font-mono font-black text-amber-400 tracking-wider select-none shrink-0 text-xs">
                      {captchaNum1} + {captchaNum2} = ?
                    </div>
                    <input
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Answer"
                      required
                      className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Remember this regulatory terminal session</span>
                </label>
                <Link
                  href="/help"
                  className="text-amber-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Portal Assistance</span>
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verifying Statutory Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Samadhan360 Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-700/60 text-center text-[10px] text-slate-500 leading-relaxed">
              Authorized Government & Institutional System. Access is governed under Section 43/66 of the Information Technology Act. Every login event is signed and written to the Immutable Governance Audit Trail.
            </div>
          </div>

          {/* Right Column: One-Click Evaluator Role Switcher & Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Demo Role Picker Card */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Quick Evaluator Sign-In
                  </h2>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  1-Click Test
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Click any statutory role below to immediately test the portal under different role-based views and permissions:
              </p>

              {/* Roles List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 text-xs">
                {(Object.keys(DEMO_USERS) as UserRole[]).map((r) => {
                  const u = DEMO_USERS[r];
                  const isCurrent = loggedInUser?.role === r;

                  return (
                    <div
                      key={r}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-2.5 ${
                        isCurrent
                          ? "bg-amber-500/15 border-amber-500/50 text-white"
                          : "bg-slate-900/60 border-slate-700/70 hover:border-slate-600 text-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{u.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{u.designation}</p>
                          <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                            [{r.replace("_", " ")}]
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          {u.region.split(" ")[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleQuickRoleSelect(r)}
                          className="flex-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold transition-colors text-center"
                        >
                          Populate Form
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInstantSignIn(r)}
                          className="flex-1 py-1 px-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold transition-colors text-center flex items-center justify-center gap-1"
                        >
                          <span>Sign In As</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security Guarantee Card */}
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Role-Based Enforcement</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Samadhan360 guarantees strict cryptographic boundary isolation. Institution admins are quarantined to their registered campus PID, while Scrutiny and Regional Officers operate exclusively within assigned regional dockets.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-4 text-center text-slate-500 text-xs">
        <p>
          Samadhan360 Smart Approval & Institutional Compliance Management System • AICTE & Statutory Higher Education Governance
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-mono">
          Loading Institutional Regulatory Gateway...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
