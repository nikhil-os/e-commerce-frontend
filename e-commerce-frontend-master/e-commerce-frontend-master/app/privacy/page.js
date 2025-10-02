"use client";

import React from "react";
import Layout from "../components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-[#C9BBF7]">
                Your privacy is important to us. This policy explains how
                SCRATCH collects, uses, and protects your personal information.
              </p>
            </div>

            {/* Content */}
            <div className="glass-card p-10">
              <div className="prose prose-invert prose-purple max-w-none">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Information We Collect
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  We collect information you provide directly to us, such as
                  when you create an account, make a purchase, or contact us for
                  support. This may include your name, email address, shipping
                  address, payment information, and communication preferences.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  We use the information we collect to:
                </p>
                <ul className="text-[#C9BBF7] mb-6 space-y-2">
                  <li>• Process and fulfill your orders</li>
                  <li>• Communicate with you about your purchases</li>
                  <li>• Provide customer support</li>
                  <li>• Improve our products and services</li>
                  <li>
                    • Send you promotional communications (with your consent)
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Information Sharing
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except as
                  described in this policy. We may share your information with
                  trusted service providers who assist us in operating our
                  website and conducting our business.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Data Security
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction. However, no method of transmission
                  over the internet is 100% secure.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Your Rights
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  You have the right to access, update, or delete your personal
                  information. You may also opt out of promotional
                  communications at any time. To exercise these rights, please
                  contact us using the information below.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <div className="text-[#C9BBF7]">
                  <p>Email: privacy@scratch.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: 123 Fashion Street, Style City, SC 12345</p>
                </div>

                <p className="text-[#C9BBF7] text-sm mt-8 opacity-70">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
