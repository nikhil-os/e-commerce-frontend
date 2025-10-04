"use client";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(form);
      if (result?.success) {
        toast.success("🎉 Login successful! Redirecting...");
        router.push("/");
      } else {
        const msg = result?.message || "Login failed";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.message || "Failed to login. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-md w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <h1 className="text-3xl font-bold text-white mb-4 text-center">
              Sign In to SCRATCH
            </h1>
            <p className="text-[#C9BBF7] text-center mb-8">
              Welcome back, cosmic traveler! Enter your credentials to access
              your account.
            </p>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="input w-full"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full flex justify-center items-center"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
            <p className="text-center text-sm mt-4 text-[#C9BBF7]">
              <Link href="/users/forgot-password" className="hover:underline">
                Forgot Password?
              </Link>
            </p>
            <p className="mt-4 text-center text-sm text-[#C9BBF7]">
              Don't have an account?
              <Link
                href="/users/signup"
                className="text-[#8D7DFA] hover:underline font-semibold ml-1"
              >
                Signup here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
