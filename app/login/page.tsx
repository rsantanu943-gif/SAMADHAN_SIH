"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { FlowGuardStore, DEMO_USERS } from "@/lib/flowguard-store";
import { UserRole } from "@/lib/types";
import { validateLoginPassword } from "@/lib/password-validation";
import {
  SMS_OTP_TTL_SECONDS,
  SMS_RESEND_COOLDOWN_SECONDS,
  getRegisteredMaskedPhone,
  generateTemporaryOtp,
  verifySmsOtpChallenge,
  formatCountdown,
} from "@/lib/sms-2fa";
import { Footer } from "@/components/layout/Footer";
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
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  HelpCircle,
  Landmark,
  LogOut,
  ChevronRight,
  Smartphone,
  Clock,
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

  const passwordValidation = validateLoginPassword(password);

  // Two-Step SMS 2FA State
  const [authStep, setAuthStep] = useState<"CREDENTIALS" | "SMS_2FA">("CREDENTIALS");
  const [smsOtpInput, setSmsOtpInput] = useState("");
  const [generatedSmsOtp, setGeneratedSmsOtp] = useState("");
  const [smsExpiresAt, setSmsExpiresAt] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const maskedPhone = getRegisteredMaskedPhone(identifier, loginMode);

  useEffect(() => {
    if (authStep !== "SMS_2FA") return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((smsExpiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [authStep, smsExpiresAt]);

  const dispatchTemporarySmsCode = () => {
    const newOtp = generateTemporaryOtp();
    const expires = Date.now() + SMS_OTP_TTL_SECONDS * 1000;
    setGeneratedSmsOtp(newOtp);
    setSmsExpiresAt(expires);
    setSecondsRemaining(SMS_OTP_TTL_SECONDS);
    setResendCooldown(SMS_RESEND_COOLDOWN_SECONDS);
    setSmsOtpInput("");
    return newOtp;
  };

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
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const syncAuth = () => {
      setLoggedInUser(FlowGuardStore.isAuthenticated() ? FlowGuardStore.getCurrentUser() : null);
    };
    syncAuth();
    return FlowGuardStore.subscribe(syncAuth);
  }, []);

  useEffect(() => {
    if (authStep !== "SMS_2FA") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAuthStep("CREDENTIALS");
        setErrorMessage(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [authStep]);

  const handleQuickRoleSelect = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (role === "INSTITUTION_ADMIN") {
      setLoginMode("INSTITUTION");
      setPermanentId("1-4029102");
      setIdentifier(user.email);
    } else {
      setLoginMode("COUNCIL");
      setIdentifier(user.email);
    }
    setPassword("samadhan@2026");
    setSecurityPin("892014");
    setCaptchaInput(String(captchaAnswer));
    setAuthStep("CREDENTIALS");
    setSmsOtpInput("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleInstantSignIn = (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    const user = DEMO_USERS[role];

    setTimeout(() => {
      const res = FlowGuardStore.login({
        role,
        email: user.email,
        rememberMe: true,
      });

      setLoggedInUser(res.user);
      setSuccessMessage(
        `Authenticated successfully as ${res.user.name} (${res.user.role.replace("_", " ")}). Redirecting...`
      );
      setIsLoading(false);

      setTimeout(() => {
        router.push(nextUrl);
      }, 1000);
    }, 600);
  };

  const handleCredentialStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate Captcha
    if (parseInt(captchaInput.trim(), 10) !== captchaAnswer) {
      setErrorMessage(
        `Security Captcha verification failed. Please enter the sum of ${captchaNum1} + ${captchaNum2}.`
      );
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

    if (!passwordValidation.isValid) {
      setErrorMessage(passwordValidation.helperText);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      dispatchTemporarySmsCode();
      setIsLoading(false);
      setAuthStep("SMS_2FA");
      setSuccessMessage(
        `Step 1 verified. A temporary 6-digit SMS 2FA code has been sent to ${maskedPhone}.`
      );
    }, 500);
  };

  const handleResendSmsOtp = () => {
    if (resendCooldown > 0) return;
    setErrorMessage(null);
    dispatchTemporarySmsCode();
    setSuccessMessage(`A new temporary 6-digit SMS verification code has been dispatched to ${maskedPhone}.`);
  };

  const handleSmsVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const verification = verifySmsOtpChallenge(smsOtpInput, generatedSmsOtp, smsExpiresAt);
    if (!verification.verified) {
      setErrorMessage(verification.reason || "SMS verification failed.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const loginParams: any = {
        password,
        rememberMe,
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
        setSuccessMessage(
          `SMS 2FA verified. Welcome, ${result.user.name} (${result.user.designation}). Directing to workspace...`
        );
        setTimeout(() => {
          router.push(nextUrl);
        }, 1000);
      } else {
        setErrorMessage("Authentication failed. Invalid statutory credentials or unrecognized user ID.");
        setAuthStep("CREDENTIALS");
        refreshCaptcha();
      }
    }, 600);
  };

  const handleSignOutCurrent = () => {
    FlowGuardStore.logout();
    setLoggedInUser(null);
    setSuccessMessage("You have been signed out of your institutional session.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] bg-botanical-grid bg-editorial-glow text-[#263B32] flex flex-col justify-between font-sans">
      {/* Top Ministry Banner */}
      <header className="border-b border-[#D5DDCB] bg-[#FAF8F1]/85 backdrop-blur-md px-6 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#263B32] to-[#1D2E27] rounded-lg flex items-center justify-center font-bold text-[#8FCDBB] text-sm tracking-tighter shadow-sm ring-1 ring-[#8FCDBB]/40">
              S360
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-[#263B32] text-lg tracking-tight group-hover:text-[#2A6557] transition-colors">
                  Samadhan360
                </span>
                <span className="text-[10px] bg-[#8FCDBB]/35 text-[#263B32] font-bold px-2 py-0.5 rounded border border-[#8FCDBB] uppercase font-mono">
                  Statutory Gateway
                </span>
              </div>
              <p className="text-[11px] text-[#68776A] font-medium">
                Ministry of Education • Smart Approval &amp; Compliance Management System
              </p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-[#263B32] bg-[#EAE2D2] px-3 py-1.5 rounded-lg border border-[#D5DDCB]">
              <ShieldCheck className="w-4 h-4 text-[#2A6557]" />
              <span className="font-semibold">NIST SP 800-53 / TLS 1.3 Grounded</span>
            </div>
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] transition-colors flex items-center gap-1 font-bold text-xs shadow-xs"
            >
              <span>Explore Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8FCDBB]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Login Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-[#FAF8F1] border border-[#D5DDCB] rounded-2xl p-6 sm:p-8 shadow-[0_14px_40px_-14px_rgba(38,59,50,0.14)] space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#B7C9A8] via-[#8FCDBB] to-[#263B32]" />

            {/* Active Session Notification if logged in */}
            {loggedInUser && (
              <div className="bg-[#8FCDBB]/20 border border-[#8FCDBB] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[#263B32] font-bold">
                    <UserCheck className="w-4 h-4 text-[#2A6557]" />
                    <span>Currently Active Session: {loggedInUser.name}</span>
                  </div>
                  <p className="text-[#68776A] text-[11px]">
                    Role: <strong className="text-[#263B32]">{loggedInUser.role.replace("_", " ")}</strong> ({loggedInUser.designation})
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={nextUrl}
                    className="px-3 py-1.5 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] font-bold rounded-lg text-xs transition-colors whitespace-nowrap shrink-0"
                  >
                    Enter Workspace
                  </Link>
                  <button
                    onClick={handleSignOutCurrent}
                    className="px-2.5 py-1.5 bg-[#FAF8F1] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch</span>
                  </button>
                </div>
              </div>
            )}

            {/* Portal Title & Tab Switcher */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase bg-[#B7C9A8]/45 text-[#263B32] border border-[#B7C9A8] font-bold px-2 py-0.5 rounded">
                  Secure Access
                </span>
                <span className="text-xs text-[#68776A] font-medium">Academic Year 2026–27</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#263B32] tracking-tight">
                Institutional Single Sign-On
              </h1>
              <p className="text-xs text-[#68776A] mt-1 leading-relaxed">
                Enter your authorized credentials to access regulatory approval dockets, scrutiny workflows, and compliance ledgers.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#EAE2D2] rounded-xl border border-[#D5DDCB] text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => {
                  setLoginMode("COUNCIL");
                  setIdentifier("scrutiny.west01@aicte-india.org");
                  setAuthStep("CREDENTIALS");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  loginMode === "COUNCIL"
                    ? "bg-[#263B32] text-[#FAF8F1] shadow-sm font-bold"
                    : "text-[#68776A] hover:text-[#263B32] hover:bg-[#FAF8F1]/60"
                }`}
              >
                <Landmark className={`w-4 h-4 ${loginMode === "COUNCIL" ? "text-[#8FCDBB]" : ""}`} />
                <span>Council &amp; Officers</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode("INSTITUTION");
                  setPermanentId("1-4029102");
                  setIdentifier("principal@vjti.ac.in");
                  setAuthStep("CREDENTIALS");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  loginMode === "INSTITUTION"
                    ? "bg-[#263B32] text-[#FAF8F1] shadow-sm font-bold"
                    : "text-[#68776A] hover:text-[#263B32] hover:bg-[#FAF8F1]/60"
                }`}
              >
                <Building2 className={`w-4 h-4 ${loginMode === "INSTITUTION" ? "text-[#8FCDBB]" : ""}`} />
                <span>Institution Portal</span>
              </button>
            </div>

            {/* Two-Step Security Progress Indicator */}
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
                  authStep === "CREDENTIALS"
                    ? "bg-[#263B32] text-[#FAF8F1] border-[#263B32]"
                    : "bg-[#8FCDBB]/30 text-[#263B32] border-[#8FCDBB]"
                }`}
              >
                {authStep === "SMS_2FA" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2A6557]" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#8FCDBB] text-[#263B32] font-mono text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                )}
                <span>Credentials</span>
              </div>
              <div className="h-[1px] flex-1 bg-[#D5DDCB]" />
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
                  authStep === "SMS_2FA"
                    ? "bg-[#263B32] text-[#FAF8F1] border-[#263B32]"
                    : "bg-[#FAF8F1] text-[#68776A] border-[#D5DDCB]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full font-mono text-[10px] font-bold flex items-center justify-center ${
                    authStep === "SMS_2FA"
                      ? "bg-[#8FCDBB] text-[#263B32]"
                      : "bg-[#EAE2D2] text-[#68776A]"
                  }`}
                >
                  2
                </span>
                <span>SMS 2FA Code</span>
              </div>
            </div>

            {/* Error & Success Banners */}
            {errorMessage && (
              <div className="bg-[#F5DDD9] border border-[#DFACA5] rounded-xl p-3.5 text-xs text-[#5E1A14] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#8C2D25] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Authentication Error: </span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-[#8FCDBB]/30 border border-[#8FCDBB] rounded-xl p-3.5 text-xs text-[#263B32] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2A6557] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Access Granted: </span>
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {/* Step 1: Login Form | Step 2: SMS 2FA Verification */}
            {authStep === "CREDENTIALS" ? (
            <form onSubmit={handleCredentialStepSubmit} className="space-y-4 text-xs">
              {/* Institution Permanent ID (Only in Institution Mode) */}
              {loginMode === "INSTITUTION" && (
                <div>
                  <label className="font-semibold text-[#263B32] mb-1.5 flex items-center justify-between">
                    <span>AICTE Permanent Institute ID (PID):</span>
                    <span className="text-[10px] text-[#2A6557] font-mono font-bold">e.g. 1-4029102 (VJTI)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68776A]" />
                    <input
                      type="text"
                      value={permanentId}
                      onChange={(e) => setPermanentId(e.target.value)}
                      placeholder="1-4029102"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email / Officer ID */}
              <div>
                <label className="block font-semibold text-[#263B32] mb-1.5">
                  {loginMode === "COUNCIL"
                    ? "Official Email / Officer Registration ID:"
                    : "Principal / Authorized Signatory Email:"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68776A]" />
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      loginMode === "COUNCIL"
                        ? "officer@aicte-india.org"
                        : "principal@institution.edu.in"
                    }
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] text-xs focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password-input" className="font-semibold text-[#263B32]">
                    Statutory Account Password:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword("samadhan@2026");
                      setErrorMessage(null);
                    }}
                    className="text-[10px] text-[#2A6557] hover:underline font-mono font-bold cursor-pointer"
                  >
                    Auto-Fill Demo Password
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68776A] pointer-events-none" />
                  <input
                    id="login-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    aria-describedby="password-validation-helper"
                    aria-invalid={password.length > 0 && !passwordValidation.isValid}
                    required
                    className={`w-full pl-9 pr-24 py-2.5 bg-[#F3EBDD] border rounded-lg text-[#263B32] placeholder:text-[#68776A] text-xs font-mono focus:outline-none focus:ring-2 transition-all ${
                      password.length > 0 && !passwordValidation.isValid
                        ? "border-[#8C2D25]/70 focus:ring-[#8C2D25]/25 focus:border-[#8C2D25]"
                        : passwordValidation.isValid
                        ? "border-[#8FCDBB] focus:ring-[#8FCDBB]/45 focus:border-[#2A6557]"
                        : "border-[#D5DDCB] focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#EAE2D2] hover:bg-[#8FCDBB]/45 text-[#263B32] border border-[#D5DDCB] flex items-center gap-1.5 transition-all cursor-pointer text-[10px] font-bold select-none"
                    title={showPassword ? "Switch to hidden password" : "Switch to plain text visibility"}
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-[#263B32] shrink-0" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-[#68776A] shrink-0" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Visual Password Strength Meter & Real-Time Helper Feedback */}
                <div
                  id="password-validation-helper"
                  aria-live="polite"
                  className="mt-2.5 p-3 rounded-xl bg-[#EAE2D2]/55 border border-[#D5DDCB] space-y-2.5"
                >
                  {/* Meter Header: Strength Label, Entropy & Complexity */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#68776A]">
                        Password Strength:
                      </span>
                      <span
                        data-testid="password-strength-label"
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border transition-colors ${
                          passwordValidation.strengthMetrics.tier === "empty"
                            ? "bg-[#FAF8F1] text-[#68776A] border-[#D5DDCB]"
                            : passwordValidation.strengthMetrics.tier === "weak"
                            ? "bg-[#F5DDD9] text-[#8C2D25] border-[#DFACA5]"
                            : passwordValidation.strengthMetrics.tier === "fair"
                            ? "bg-[#F5E9D3] text-[#8A5A16] border-[#DFC496]"
                            : passwordValidation.strengthMetrics.tier === "good"
                            ? "bg-[#B7C9A8]/45 text-[#263B32] border-[#9BB289]"
                            : "bg-[#8FCDBB]/40 text-[#263B32] border-[#72B7A3]"
                        }`}
                      >
                        {passwordValidation.strengthMetrics.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#68776A]">
                      <span
                        data-testid="password-entropy-bits"
                        className="bg-[#FAF8F1] px-2 py-0.5 rounded border border-[#D5DDCB] text-[#263B32] font-semibold"
                      >
                        Entropy: {passwordValidation.strengthMetrics.entropyBits} bits
                      </span>
                      <span className="bg-[#FAF8F1] px-2 py-0.5 rounded border border-[#D5DDCB] text-[#263B32] font-semibold">
                        {passwordValidation.strengthMetrics.charClasses}/4 classes
                      </span>
                    </div>
                  </div>

                  {/* Color-Coded 4-Tier Segmented Visual Meter */}
                  <div
                    role="progressbar"
                    aria-label="Password strength meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={passwordValidation.strengthMetrics.percentage}
                    className="grid grid-cols-4 gap-1.5"
                  >
                    {[1, 2, 3, 4].map((segment) => {
                      const active = passwordValidation.strengthMetrics.score >= segment;
                      const tier = passwordValidation.strengthMetrics.tier;
                      const barColor = !active
                        ? "bg-[#D5DDCB]"
                        : tier === "weak"
                        ? "bg-[#8C2D25]"
                        : tier === "fair"
                        ? "bg-[#B47B2B]"
                        : tier === "good"
                        ? "bg-[#6D9768]"
                        : "bg-[#2A6557]";
                      return (
                        <div
                          key={segment}
                          className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
                        />
                      );
                    })}
                  </div>

                  {/* Pattern / Entropy Diagnostic Feedback */}
                  <p className="text-[11px] leading-snug text-[#263B32]/85 font-medium">
                    {passwordValidation.strengthMetrics.feedback}
                  </p>

                  {/* Common Pattern Warning Badges */}
                  {passwordValidation.strengthMetrics.detectedPatterns.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {passwordValidation.strengthMetrics.detectedPatterns.map((pattern) => (
                        <span
                          key={pattern}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F5DDD9] text-[#8C2D25] border border-[#DFACA5]"
                        >
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Pattern: {pattern}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Statutory Requirement Helper Message */}
                  <p
                    className={`text-[11px] leading-snug flex items-start gap-1.5 font-medium pt-1.5 border-t border-[#D5DDCB]/80 ${
                      password.length === 0
                        ? "text-[#68776A]"
                        : passwordValidation.isValid
                        ? "text-[#2A6557]"
                        : "text-[#8C2D25]"
                    }`}
                  >
                    {passwordValidation.isValid ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#2A6557]" />
                    ) : (
                      <AlertCircle
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          password.length === 0 ? "text-[#68776A]" : "text-[#8C2D25]"
                        }`}
                      />
                    )}
                    <span>{passwordValidation.helperText}</span>
                  </p>

                  {/* Minimum Length & Character Requirement Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {passwordValidation.checks.map((check) => (
                      <span
                        key={check.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                          check.met
                            ? "bg-[#8FCDBB]/30 text-[#263B32] border-[#8FCDBB]"
                            : password.length > 0
                            ? "bg-[#F5DDD9]/70 text-[#5E1A14] border-[#E5B8B0]"
                            : "bg-[#FAF8F1] text-[#68776A] border-[#D5DDCB]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            check.met
                              ? "bg-[#2A6557]"
                              : password.length > 0
                              ? "bg-[#8C2D25]"
                              : "bg-[#68776A]/60"
                          }`}
                        />
                        <span>{check.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {showPassword && (
                  <p className="text-[10px] text-[#2A6557] flex items-center gap-1.5 mt-1.5 font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2A6557]" />
                    <span>Password visibility enabled (plain text mode)</span>
                  </p>
                )}
              </div>

              {/* 2FA Security PIN & Dynamic Captcha Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 2FA PIN */}
                <div>
                  <label className="font-semibold text-[#263B32] mb-1.5 flex items-center justify-between">
                    <span>2FA Security Token / PIN:</span>
                    <span className="text-[10px] text-[#68776A] font-mono">6 Digits</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68776A]" />
                    <input
                      type="text"
                      maxLength={6}
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      placeholder="892014"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] font-mono text-xs tracking-wider focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB]"
                    />
                  </div>
                </div>

                {/* Captcha Challenge */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-[#263B32]">Security Captcha:</label>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-[10px] text-[#68776A] hover:text-[#263B32] flex items-center gap-1 cursor-pointer font-semibold"
                      title="Generate new calculation"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#263B32] px-3 py-2 rounded-lg border border-[#263B32] font-mono font-bold text-[#8FCDBB] tracking-wider select-none shrink-0 text-xs">
                      {captchaNum1} + {captchaNum2} = ?
                    </div>
                    <input
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Answer"
                      required
                      className="w-full px-3 py-2 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB]"
                    />
                  </div>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#68776A] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#D5DDCB] bg-[#F3EBDD] text-[#263B32] accent-[#263B32] focus:ring-[#8FCDBB]"
                  />
                  <span>Remember this regulatory terminal session</span>
                </label>
                <Link
                  href="/help"
                  className="text-[#2A6557] hover:underline text-[11px] font-bold flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Portal Assistance</span>
                </Link>
              </div>

              {/* Submit Button (Step 1 -> Request SMS 2FA) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#8FCDBB]" />
                    <span>Dispatching SMS 2FA Code...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 text-[#8FCDBB]" />
                    <span>Continue to SMS 2FA Verification</span>
                    <ArrowRight className="w-4 h-4 text-[#8FCDBB]" />
                  </>
                )}
              </button>
            </form>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onSubmit={handleSmsVerificationSubmit}
                className="space-y-4 text-xs"
              >
                {/* Registered Phone Dispatch Summary */}
                <div className="p-4 rounded-xl bg-[#EAE2D2]/65 border border-[#D5DDCB] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#263B32] text-[#8FCDBB] flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#263B32] text-xs">
                          SMS Verification Required
                        </p>
                        <p className="text-[11px] text-[#68776A]">
                          Registered Mobile:{" "}
                          <span className="font-mono font-bold text-[#263B32]">{maskedPhone}</span>
                        </p>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold ${
                        secondsRemaining > 0
                          ? "bg-[#FAF8F1] text-[#263B32] border-[#D5DDCB]"
                          : "bg-[#F5DDD9] text-[#8C2D25] border-[#DFACA5]"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-[#2A6557]" />
                      <span>
                        {secondsRemaining > 0
                          ? `Expires ${formatCountdown(secondsRemaining)}`
                          : "Code Expired"}
                      </span>
                    </div>
                  </div>

                  {/* Simulated SMS Gateway Preview Banner */}
                  <div className="p-2.5 rounded-lg bg-[#FAF8F1] border border-[#8FCDBB] flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#2A6557]">
                        Simulated SMS Gateway Preview
                      </p>
                      <p className="text-[11px] text-[#263B32]">
                        Your temporary Samadhan360 login code is{" "}
                        <strong
                          data-testid="simulated-sms-otp"
                          className="font-mono text-xs bg-[#8FCDBB]/35 px-1.5 py-0.5 rounded border border-[#8FCDBB] text-[#263B32] tracking-widest"
                        >
                          {generatedSmsOtp}
                        </strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSmsOtpInput(generatedSmsOtp);
                        setErrorMessage(null);
                      }}
                      className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#EAE2D2] hover:bg-[#8FCDBB]/45 text-[#263B32] border border-[#D5DDCB] transition-colors cursor-pointer"
                    >
                      Auto-Fill SMS Code
                    </button>
                  </div>
                </div>

                {/* Temporary 6-Digit SMS Code Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="sms-otp-input" className="font-semibold text-[#263B32]">
                      Temporary 6-Digit SMS 2FA Code:
                    </label>
                    <button
                      type="button"
                      onClick={handleResendSmsOtp}
                      disabled={resendCooldown > 0}
                      className="text-[10px] font-mono font-bold text-[#2A6557] hover:underline disabled:text-[#68776A] disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                    >
                      {resendCooldown > 0
                        ? `Resend SMS in ${resendCooldown}s`
                        : "Resend SMS Code"}
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68776A]" />
                    <input
                      id="sms-otp-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={smsOtpInput}
                      onChange={(e) => {
                        setSmsOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6));
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Enter 6-digit SMS code"
                      autoComplete="one-time-code"
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-xs font-mono text-sm tracking-[0.25em] font-bold focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB] transition-all"
                    />
                  </div>
                </div>

                {/* Step 2 Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep("CREDENTIALS");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="sm:w-auto px-4 py-3 rounded-xl bg-[#FAF8F1] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Credentials</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#8FCDBB]" />
                        <span>Verifying SMS Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify SMS Code &amp; Sign In</span>
                        <ArrowRight className="w-4 h-4 text-[#8FCDBB]" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            <div className="pt-3 border-t border-[#D5DDCB] text-center text-[10px] text-[#68776A] leading-relaxed">
              Authorized Government &amp; Institutional System. Access is governed under Section 43/66 of the Information Technology Act. Every login event is signed and written to the Immutable Governance Audit Trail.
            </div>
          </motion.div>

          {/* Right Column: One-Click Evaluator Role Switcher & Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Demo Role Picker Card */}
            <div className="bg-[#FAF8F1] border border-[#D5DDCB] rounded-2xl p-5 shadow-[0_10px_30px_-14px_rgba(38,59,50,0.12)] space-y-3">
              <div className="flex items-center justify-between border-b border-[#D5DDCB] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2A6557]" />
                  <h2 className="font-display text-base font-bold text-[#263B32]">
                    Quick Evaluator Sign-In
                  </h2>
                </div>
                <span className="text-[10px] font-mono bg-[#B7C9A8]/45 text-[#263B32] border border-[#B7C9A8] px-2 py-0.5 rounded font-bold">
                  1-Click Test
                </span>
              </div>

              <p className="text-[11px] text-[#68776A] leading-relaxed">
                Select any statutory role below to immediately test the portal under different role-based views and permissions:
              </p>

              {/* Roles List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 text-xs">
                {(Object.keys(DEMO_USERS) as UserRole[]).map((r) => {
                  const u = DEMO_USERS[r];
                  const isCurrent = loggedInUser?.role === r;

                  return (
                    <div
                      key={r}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-2.5 ${
                        isCurrent
                          ? "bg-[#8FCDBB]/25 border-[#8FCDBB] text-[#263B32]"
                          : "bg-[#F3EBDD]/70 border-[#D5DDCB] hover:border-[#B7C9A8] text-[#263B32]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#263B32] text-xs">{u.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-[#263B32] text-[#8FCDBB] px-1.5 py-0.5 rounded font-bold uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#68776A] mt-0.5">{u.designation}</p>
                          <span className="text-[9px] font-mono text-[#2A6557] font-bold uppercase tracking-wider">
                            [{r.replace("_", " ")}]
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-[#263B32] bg-[#FAF8F1] px-1.5 py-0.5 rounded border border-[#D5DDCB]">
                          {u.region.split(" ")[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1.5 border-t border-[#D5DDCB]/70">
                        <button
                          type="button"
                          onClick={() => handleQuickRoleSelect(r)}
                          className="flex-1 py-1.5 px-2 rounded-md bg-[#FAF8F1] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] text-[10px] font-semibold transition-colors text-center cursor-pointer"
                        >
                          Populate Form
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInstantSignIn(r)}
                          className="flex-1 py-1.5 px-2 rounded-md bg-[#8FCDBB] hover:bg-[#7DC2AE] text-[#263B32] border border-[#72B7A3] text-[10px] font-bold transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
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
            <div className="bg-[#EAE2D2]/80 border border-[#D5DDCB] p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#263B32] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#2A6557]" />
                <span>Statutory Role-Based Enforcement</span>
              </div>
              <p className="text-[#68776A] text-[11px] leading-relaxed">
                Samadhan360 guarantees strict cryptographic boundary isolation. Institution admins are quarantined to their registered campus PID, while Scrutiny and Regional Officers operate exclusively within assigned regional dockets.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3EBDD] flex items-center justify-center text-[#68776A] text-xs font-mono">
          Loading Institutional Regulatory Gateway...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
