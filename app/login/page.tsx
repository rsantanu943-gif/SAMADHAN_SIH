"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { login, signup, logout, getUser, handleAuthCallback, requestPasswordRecovery, updateUser, acceptInvite, AuthError, MissingIdentityError } from "@netlify/identity";
import { ShieldCheck, ArrowRight, Mail, LockKeyhole, Eye, EyeOff, BadgeCheck, LoaderCircle } from "lucide-react";

type Mode = "login" | "signup" | "forgot" | "reset" | "invite";

export default function LoginPage() {
  const callbackPromise = useRef<ReturnType<typeof handleAuthCallback> | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function enterWorkspace() {
    const response = await fetch("/api/auth/session", { cache: "no-store" });
    if (!response.ok) {
      await logout();
      throw new Error("Access is restricted to approved, verified accounts. Contact your administrator if you need access.");
    }
    window.location.replace("/");
  }

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        callbackPromise.current ??= handleAuthCallback();
        const callback = await callbackPromise.current;
        if (!active) return;
        if (callback?.type === "recovery") { setMode("reset"); return; }
        if (callback?.type === "invite") { setInviteToken(callback.token ?? ""); setMode("invite"); return; }
        if (await getUser()) await enterWorkspace();
      } catch {
        if (active) setError("We could not complete sign-in. Please sign in again or request a new verification link.");
      } finally { if (active) setChecking(false); }
    }
    void initialize();
    return () => { active = false; };
  }, []);

  function changeMode(next: Mode) { setMode(next); setError(""); setNotice(""); setPassword(""); setConfirmPassword(""); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setNotice(""); setBusy(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if ((mode === "signup" || mode === "reset" || mode === "invite") && password !== confirmPassword) throw new Error("The passwords do not match.");
      if (mode === "forgot") {
        await requestPasswordRecovery(normalizedEmail);
        setNotice("If this email has an account, a password reset link is on its way. Check your inbox and spam folder.");
      } else if (mode === "signup") {
        await signup(normalizedEmail, password);
        // Require verification even if project settings change to autoconfirm.
        await logout();
        setMode("login"); setPassword(""); setConfirmPassword("");
        setNotice("Account request received. Check your inbox to verify your email before signing in. Only approved accounts can access the workspace.");
      } else if (mode === "reset" || mode === "invite") {
        if (mode === "invite") await acceptInvite(inviteToken, password);
        else await updateUser({ password });
        await enterWorkspace();
      } else {
        await login(normalizedEmail, password);
        await enterWorkspace();
      }
    } catch (err) {
      if (err instanceof MissingIdentityError) setError("Sign-in is temporarily unavailable. Please try again later.");
      else if (err instanceof AuthError) setError(mode === "login" ? "Unable to sign in. Check your email and password, and make sure your email is verified." : "Unable to complete this request. Use your approved email address or contact your administrator.");
      else setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }

  const creatingPassword = mode === "signup" || mode === "reset" || mode === "invite";
  const title = mode === "signup" ? "Set up your account." : mode === "forgot" ? "Let’s get you back in." : creatingPassword ? "Choose your password." : "Welcome back.";
  return <main className="login-shell"><section className="login-story"><a href="/login" className="login-brand"><ShieldCheck size={32}/><span>samadhan<b>360</b><small>APPROVAL & COMPLIANCE</small></span></a><div className="login-story-content"><span className="login-kicker">A TRUSTED WORKSPACE</span><h1>Every approval.<br/>A clearer path.</h1><p>The right people. The right information.<br/>One workspace for institutional confidence.</p><div className="login-seal" aria-hidden="true"><div/><div/><ShieldCheck size={64}/></div><span className="login-story-note"><BadgeCheck size={17}/> Purpose-built for institutional compliance</span></div><footer>Samadhan360 · Institutional trust, by design.</footer></section><section className="login-form-side"><div className="login-form-wrap"><div className="login-access-label"><LockKeyhole size={13}/> AUTHORIZED ACCESS ONLY</div><h2>{title}</h2><p className="login-description">{mode === "login" ? "Sign in to your Samadhan360 workspace with your approved email address." : mode === "signup" ? "Use your approved email address and verify it to activate your account." : mode === "forgot" ? "Enter your account email to receive a password reset link." : "Set a secure password to access your workspace."}</p>{checking ? <div role="status" className="login-loading"><LoaderCircle size={20} className="animate-spin"/> Checking your session…</div> : <form onSubmit={submit} className="login-form">{mode !== "reset" && mode !== "invite" && <label htmlFor="email">Email address<div className="login-input"><Mail size={17}/><input id="email" name="email" type="email" autoComplete="email" placeholder="you@institution.edu" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy}/></div></label>}{mode !== "forgot" && <label htmlFor="password">{creatingPassword ? "New password" : "Password"}<div className="login-input"><LockKeyhole size={17}/><input id="password" name="password" type={visible ? "text" : "password"} autoComplete={creatingPassword ? "new-password" : "current-password"} minLength={creatingPassword ? 12 : undefined} placeholder={creatingPassword ? "At least 12 characters" : "Enter your password"} required value={password} onChange={e => setPassword(e.target.value)} disabled={busy}/><button type="button" aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>}{creatingPassword && <label htmlFor="confirm-password">Confirm password<div className="login-input"><LockKeyhole size={17}/><input id="confirm-password" name="confirm-password" type={visible ? "text" : "password"} autoComplete="new-password" required minLength={12} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={busy}/></div></label>}{mode === "login" && <button className="login-text-button forgot-button" type="button" onClick={() => changeMode("forgot")}>Forgot password?</button>}{error && <p className="login-message login-error" role="alert">{error}</p>}{notice && <p className="login-message login-notice" role="status">{notice}</p>}<button type="submit" className="login-submit" disabled={busy}>{busy ? <><LoaderCircle size={17} className="animate-spin"/> Please wait…</> : <>{mode === "login" ? "Sign in to workspace" : mode === "signup" ? "Create approved account" : mode === "forgot" ? "Send reset link" : "Save password & continue"}<ArrowRight size={17}/></>}</button>{mode === "login" ? <p className="login-switch">First time here? <button type="button" className="login-text-button" onClick={() => changeMode("signup")} disabled={busy}>Set up your account</button></p> : <button type="button" className="login-text-button login-back" onClick={() => changeMode("login")} disabled={busy}>Back to sign in</button>}</form>}<div className="login-restriction"><ShieldCheck size={20}/><p><strong>A workspace for selected people.</strong><span>Access requires an approved email address and a verified account. Contact your administrator for help.</span></p></div></div><span className="login-form-footer">Protected access · Samadhan360</span></section></main>;
}
