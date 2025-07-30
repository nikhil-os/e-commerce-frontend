"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    contact: "",
    location: "",
    profilepic: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!authUser) {
      router.push("/users/login");
      return;
    }

    // Pre-fill form with current user data
    setForm({
      fullname: authUser.fullname || "",
      contact: authUser.contact || "",
      location: authUser.location || "",
      profilepic: null,
    });
  }, [authUser, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilepic" && files[0]) {
      setForm((f) => ({ ...f, [name]: files[0] }));
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("contact", form.contact);
      formData.append("location", form.location);
      if (form.profilepic) {
        formData.append("profilepic", form.profilepic);
      }

      const response = await fetch(
        "http://localhost:5000/api/users/update-profile",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
        setTimeout(() => router.push("/users/profile"), 2000);
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      setMessage("An error occurred while updating profile");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#8f6690] via-[#a578a8] to-[#b278a8] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-purple-100">Update your personal information</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-6"
              >
                {/* Profile Picture Section */}
                <div className="text-center">
                  <div className="relative inline-block">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                      />
                    ) : authUser?.profilepic ? (
                      <img
                        src={`/uploads/${authUser.profilepic}`}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8f6690] to-[#b278a8] flex items-center justify-center shadow-xl border-4 border-white">
                        <span className="text-2xl font-bold text-white">
                          {authUser?.fullname?.charAt(0)?.toUpperCase() || "👤"}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#8f6690] to-[#b278a8] rounded-full p-2 shadow-lg">
                      <span className="text-white text-sm">📷</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Change Profile Picture
                    </label>
                    <input
                      type="file"
                      name="profilepic"
                      accept="image/*"
                      onChange={handleChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#8f6690] file:to-[#b278a8] file:text-white hover:file:shadow-md file:transition-all"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={form.fullname}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80"
                    placeholder="Enter your city or location"
                  />
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`p-4 rounded-xl ${
                      message.includes("success")
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>💾 Update Profile</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/users/profile")}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    🔙 Back to Profile
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-3">
              📋 Profile Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-purple-100">
              <li>• Use a clear, professional profile picture</li>
              <li>• Keep your contact information up to date</li>
              <li>• Your profile helps us serve you better</li>
              <li>• All information is kept secure and private</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
