
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

const EMAIL = "dev.aert@gmail.com";
const PASS = "helloworld";

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);

  const [email, setEmail] = useState(EMAIL);
  const [password, setPassword] = useState(PASS);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Clear field-level errors when field changes
  useEffect(() => { setErrors((e) => ({ ...e, email: undefined })); }, [email]);
  useEffect(() => { setErrors((e) => ({ ...e, password: undefined })); }, [password]);

  const disabled = !email || !password || !isValidEmail(email) || loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "E-mail is required";
    else if (!isValidEmail(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Login failed" }));
        throw new Error(err.message || "Login failed");
      }
      const data = await res.json();
      setUser(data.user);
      router.replace("/dashboard");
    } catch (err: any) {
      setErrors({ form: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="panel">
        <div className="grid2">
          {/* Left content */}
          <div>
            <h1 className="title-lg">Welcome back</h1>
            <p className="muted">Step into our shopping metaverse for an unforgettable shopping experience</p>

            <form onSubmit={onSubmit} className="stack">
              <div className="input-wrap">
                <MailIcon className="icon" />
                <input
                  id="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                />
              </div>
              <div className="error">{errors.email}</div>

              <div className="input-wrap">
                <LockIcon className="icon" />
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>
              <div className="error">{errors.password}</div>

              {errors.form ? <div className="error">{errors.form}</div> : <div className="error" />}

              <button className="btn" type="submit" disabled={disabled}>
                {loading ? "Signing in..." : "Login"}
              </button>

              <div className="signup" style={{ textAlign: "center", paddingTop: 4 }}>
                Don’t have an account? <a href="#" style={{ textDecoration: "underline" }}>Sign up</a>
              </div>
            </form>
          </div>

          {/* Right visual */}
          <div className="visual">
            <div style={{ textAlign: "center" }}>
              <img src="/vr-shape.png" alt="Metaverse shape" />
              <div className="logo">meetus<sup>VR</sup></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
