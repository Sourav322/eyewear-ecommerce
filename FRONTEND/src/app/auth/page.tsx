// src/app/auth/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

type Mode = "login" | "register" | "forgot";

export default function AuthPage() {
  const { login, register } = useAuth();
  const router              = useRouter();

  const [mode, setMode]       = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
    confirm:  "",
  });

  const updateForm = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ── SUBMIT HANDLER ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        // Validation
        if (!form.email || !form.password) {
          toast.error("Please fill all fields");
          return;
        }
        await login(form.email, form.password);
        router.push("/dashboard");

      } else if (mode === "register") {
        // Validation
        if (!form.name || !form.email || !form.password) {
          toast.error("Please fill all fields");
          return;
        }
        if (form.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        if (form.password !== form.confirm) {
          toast.error("Passwords do not match");
          return;
        }
        await register(form.name, form.email, form.password);
        router.push("/dashboard");

      } else if (mode === "forgot") {
        if (!form.email) {
          toast.error("Please enter your email");
          return;
        }
        // TODO: Call forgot password API
        toast.success("Password reset link sent to your email!");
        setMode("login");
      }

    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-16 flex items-center
                 justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #0F172A 0%, #164E63 100%)",
      }}
    >
      {/* Background Orbs */}
      <div
        className="fixed top-20 right-20 w-80 h-80 rounded-full
                   opacity-15 pointer-events-none"
        style={{ background: "#0EA5E9", filter: "blur(80px)" }}
      />
      <div
        className="fixed bottom-10 left-10 w-60 h-60 rounded-full
                   opacity-10 pointer-events-none"
        style={{ background: "#7C3AED", filter: "blur(60px)" }}
      />

      <div className="w-full max-w-md relative z-10">

        {/* ── CARD ─────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.3)" }}
        >
          {/* Header */}
          <div className="p-8 pb-0 text-center">
            <Link href="/">
              <div className="font-black text-2xl mb-1 inline-block">
                Lens<span style={{ color: "#0EA5E9" }}>Kart</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm mb-6">
              {mode === "login"
                ? "Welcome back! 👋"
                : mode === "register"
                ? "Create your account 🎉"
                : "Reset your password 🔑"}
            </p>

            {/* Mode Toggle — only for login/register */}
            {mode !== "forgot" && (
              <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="flex-1 py-2.5 rounded-lg text-sm
                               font-bold capitalize transition-all"
                    style={{
                      background: mode === m ? "white" : "transparent",
                      color:      mode === m ? "#0F172A" : "#64748B",
                      boxShadow:
                        mode === m
                          ? "0 2px 8px rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    {m === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── FORM ─────────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            className="px-8 pb-8 space-y-4"
          >
            {/* Name — Register only */}
            {mode === "register" && (
              <div>
                <label
                  className="text-xs font-bold text-slate-400
                             uppercase tracking-wider mb-2 block"
                >
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="input-base"
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                className="text-xs font-bold text-slate-400
                           uppercase tracking-wider mb-2 block"
              >
                Email Address
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="Enter your email"
                className="input-base"
                autoComplete="email"
              />
            </div>

            {/* Password — Login & Register */}
            {mode !== "forgot" && (
              <div>
                <label
                  className="text-xs font-bold text-slate-400
                             uppercase tracking-wider mb-2 block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      updateForm("password", e.target.value)
                    }
                    placeholder="Enter your password"
                    className="input-base pr-12"
                    autoComplete={
                      mode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               text-slate-400 hover:text-slate-600
                               text-xs font-medium"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                {mode === "register" && (
                  <p className="text-xs text-slate-400 mt-1">
                    Minimum 6 characters
                  </p>
                )}
              </div>
            )}

            {/* Confirm Password — Register only */}
            {mode === "register" && (
              <div>
                <label
                  className="text-xs font-bold text-slate-400
                             uppercase tracking-wider mb-2 block"
                >
                  Confirm Password
                </label>
                <input
                  required
                  type="password"
                  value={form.confirm}
                  onChange={(e) =>
                    updateForm("confirm", e.target.value)
                  }
                  placeholder="Re-enter your password"
                  className="input-base"
                  autoComplete="new-password"
                />
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Forgot Password Link */}
            {mode === "login" && (
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-sky-500 font-medium
                             hover:text-sky-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms — Register only */}
            {mode === "register" && (
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  className="mt-0.5 accent-sky-500"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-slate-500 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-sky-500 font-medium hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-sky-500 font-medium hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-white
                         transition-all hover:scale-[1.02]
                         active:scale-[0.98] disabled:opacity-70
                         flex items-center justify-center gap-3"
              style={{
                background:
                  "linear-gradient(135deg, #0EA5E9, #0284C7)",
                boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="w-5 h-5 border-2 border-white/30
                               border-t-white rounded-full animate-spin"
                  />
                  Please wait...
                </>
              ) : mode === "login" ? (
                "Sign In →"
              ) : mode === "register" ? (
                "Create Account →"
              ) : (
                "Send Reset Link →"
              )}
            </button>

            {/* Divider */}
            {mode !== "forgot" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span
                      className="bg-white px-3 text-slate-400
                                 font-medium"
                    >
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  className="w-full py-3 rounded-2xl font-bold
                             text-slate-600 border border-slate-200
                             text-sm flex items-center justify-center
                             gap-3 hover:bg-slate-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            {/* Back to Login — Forgot mode */}
            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="w-full py-3 rounded-2xl font-bold
                           text-slate-600 border border-slate-200
                           text-sm hover:bg-slate-50 transition-colors"
              >
                ← Back to Sign In
              </button>
            )}
          </form>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-xs text-slate-500 mt-6">
          🔒 Your data is safe with us. We never share your info.
        </p>
      </div>
    </div>
  );
}

