"use client";
import React, { useState } from "react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import LocationPicker from "../../components/LocationPicker";
import Layout from "../../components/Layout";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [location, setLocation] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const toast = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateRecaptcha = () => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        }
      );
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    generateRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, form.phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast.success("📱 OTP sent successfully to your phone!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(
        "Failed to send OTP. Please check the phone number and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      toast.warning("Please send an OTP first.");
      return;
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(form.otp);
      setVerified(true);
      toast.success("✅ Phone number verified successfully!");
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      toast.warning("⚠️ Please verify your phone number first.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }
    if (form.password.length < 6) {
      toast.warning("⚠️ Password must be at least 6 characters long.");
      return;
    }
    if (!acceptedTerms) {
      toast.warning("⚠️ Please accept the Terms and Conditions to continue.");
      return;
    }
    if (!location) {
      toast.warning("⚠️ Please provide your location for better service.");
      return;
    }
    setLoading(true);
    try {
  const res = await fetch("https://e-commerce-backend-1-if2s.onrender.com/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          contact: form.phone,
          location: {
            address: location.address?.formatted || location.fullAddress || "",
            coordinates: location.coordinates
              ? {
                  latitude:
                    location.coordinates.lat || location.coordinates.latitude,
                  longitude:
                    location.coordinates.lng || location.coordinates.longitude,
                }
              : null,
            city: location.address?.city || location.city || "",
            state: location.address?.state || location.state || "",
            country: location.address?.country || location.country || "",
            zipCode:
              location.address?.zip || location.zipCode || location.zip || "",
          },
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("🎉 Signup successful! Welcome to our community!");
        console.log(data);

        // Automatically log in the user with their signup credentials
        try {
          const loginResult = await login({
            email: form.email,
            password: form.password,
          });

          if (loginResult.success) {
            toast.success("🚀 Redirecting to your dashboard...");
            setTimeout(() => {
              router.push("/"); // Redirect to home page instead of login
            }, 1500);
          } else {
            // If auto-login fails, redirect to login page
            toast.warning("Please login with your new credentials");
            setTimeout(() => {
              router.push("/users/login");
            }, 2000);
          }
        } catch (loginError) {
          console.error("Auto-login error:", loginError);
          toast.warning("Please login with your new credentials");
          setTimeout(() => {
            router.push("/users/login");
          }, 2000);
        }
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div id="recaptcha-container"></div>
      <section className="relative flex items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full max-w-xl mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <h1 className="mb-4 text-3xl font-bold text-center text-white">
              Create Your Cosmic Account
            </h1>
            <p className="text-[#C9BBF7] text-center mb-8">
              Join the cosmic community and unlock stellar shopping experiences!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="fullname"
                type="text"
                placeholder="Full Name"
                className="input"
                value={form.fullname}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="flex items-center gap-2">
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone (+91...)"
                  className="flex-1 input"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                />
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="px-4 btn btn-secondary"
                  disabled={otpSent || loading}
                >
                  {otpSent ? "Resend" : "Send OTP"}
                </button>
                {verified && (
                  <span className="flex items-center gap-1 text-sm font-medium text-green-400">
                    ✅ Verified
                  </span>
                )}
              </div>
              {otpSent && !verified ? (
                <div className="flex gap-2 mt-2">
                  <input
                    name="otp"
                    type="text"
                    placeholder="Enter OTP"
                    className="flex-1 input"
                    value={form.otp}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="px-4 btn btn-accent"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              ) : null}

              {/* Location Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Your Location
                </label>
                <LocationPicker
                  onLocationChange={setLocation}
                  initialLocation={location}
                />
                {location && (
                  <div className="text-xs text-[#C9BBF7] bg-white/5 rounded-lg p-2">
                    📍{" "}
                    {location.fullAddress ||
                      location.formatted ||
                      "Location detected"}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="input w-full"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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

              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={`input w-full ${
                    form.confirmPassword &&
                    form.password !== form.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : form.confirmPassword &&
                        form.password === form.confirmPassword
                      ? "border-green-500 focus:border-green-500"
                      : ""
                  }`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
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
                {/* Password match indicator */}
                {form.confirmPassword && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    {form.password === form.confirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#8D7DFA] bg-transparent border-2 border-[#8D7DFA] rounded focus:ring-[#8D7DFA] focus:ring-2"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[#C9BBF7] leading-relaxed"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[#8D7DFA] hover:text-white underline hover:no-underline transition-colors font-medium"
                  >
                    Terms and Conditions
                  </button>{" "}
                  and understand that by signing up, I accept all the terms
                  outlined for using SCRATCH services.
                </label>
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={!verified || !acceptedTerms || loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-[#C9BBF7]">
              Already have an account?
              <Link
                href="/users/login"
                className="text-[#8D7DFA] hover:underline font-semibold ml-1"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-4xl max-h-[80vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              ×
            </button>

            <div className="pr-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                SCRATCH Terms and Conditions
              </h2>

              <div className="space-y-6 text-[#C9BBF7]">
                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Account Responsibility
                    </h3>
                    <p className="text-sm leading-relaxed">
                      You are responsible for maintaining the confidentiality of
                      your account credentials and all activities that occur
                      under your account. Please notify us immediately of any
                      unauthorized use.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Product Information
                    </h3>
                    <p className="text-sm leading-relaxed">
                      While we strive for accuracy, product descriptions,
                      prices, and availability are subject to change without
                      notice. SCRATCH reserves the right to correct any errors
                      or inaccuracies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Payment Terms
                    </h3>
                    <p className="text-sm leading-relaxed">
                      All payments must be received before product shipment. We
                      accept major credit cards, PayPal, and other secure
                      payment methods. Prices include applicable taxes unless
                      stated otherwise.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Shipping and Delivery
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Shipping times are estimates and may vary based on
                      location and product availability. SCRATCH is not
                      responsible for delays caused by shipping carriers or
                      customs processing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    5
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Return and Refund Policy
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Returns are accepted within 30 days of purchase for unused
                      items in original packaging. Refunds will be processed
                      within 5-7 business days after we receive the returned
                      item.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    6
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Privacy Protection
                    </h3>
                    <p className="text-sm leading-relaxed">
                      We respect your privacy and protect your personal
                      information. Your data will only be used for order
                      processing, customer service, and improving your shopping
                      experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    7
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Prohibited Activities
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Users may not engage in fraudulent activities, abuse our
                      services, or violate any applicable laws. We reserve the
                      right to suspend or terminate accounts that violate these
                      terms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    8
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Quality Guarantee
                    </h3>
                    <p className="text-sm leading-relaxed">
                      SCRATCH is committed to providing high-quality fashion and
                      lifestyle products. If you're not satisfied with your
                      purchase, contact our customer service team for
                      assistance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    9
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Limitation of Liability
                    </h3>
                    <p className="text-sm leading-relaxed">
                      SCRATCH's liability is limited to the purchase price of
                      the product. We are not responsible for any indirect,
                      incidental, or consequential damages arising from product
                      use.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#8D7DFA] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    10
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Terms Modification
                    </h3>
                    <p className="text-sm leading-relaxed">
                      SCRATCH reserves the right to modify these terms at any
                      time. Continued use of our services after changes
                      constitutes acceptance of the updated terms. Check this
                      page regularly for updates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#8D7DFA]/30 text-center">
                <button
                  onClick={() => {
                    setAcceptedTerms(true);
                    setShowTermsModal(false);
                  }}
                  className="btn btn-primary mr-4"
                >
                  Accept Terms
                </button>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
