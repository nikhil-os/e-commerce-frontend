'use client';

import React from 'react';
import Layout from '../components/Layout';

export default function Terms() {
  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Terms of Service
              </h1>
              <p className="text-xl text-[#C9BBF7]">
                Please read these terms carefully before using SCRATCH’s
                services.
              </p>
            </div>

            {/* Content */}
            <div className="p-10 glass-card">
              <div className="prose prose-invert prose-purple max-w-none">
                <h2 className="mb-4 text-2xl font-bold text-white">
                  1. Acceptance of Terms
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  By accessing and using the SCRATCH website and services, you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to these terms, you should
                  not use our services.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-white">
                  2. Use License
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  Permission is granted to temporarily download one copy of the
                  materials on SCRATCH’s website for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a
                  transfer of title.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-white">
                  3. Product Information
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  We strive to provide accurate product descriptions and pricing
                  information. However, we do not warrant that product
                  descriptions or other content is accurate, complete, reliable,
                  current, or error-free.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-white">
                  4. Pricing and Payment
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  All prices are subject to change without notice. We reserve
                  the right to refuse or cancel any order placed for a product
                  listed at an incorrect price. Payment must be received by us
                  before we ship any product.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-white">
                  5. Shipping and Returns
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  We offer various shipping options and will provide tracking
                  information once your order ships. Returns are accepted within
                  30 days of purchase, subject to our return policy conditions.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-white">
                  6. User Accounts
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account. Please notify us immediately of any
                  unauthorized use of your account.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-white">
                  7. Prohibited Uses
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  You may not use our services for any unlawful purpose or to
                  solicit others to perform unlawful acts. You may not violate
                  any international, federal, provincial, or state regulations,
                  rules, or laws.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-white">
                  8. Limitation of Liability
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  In no case shall SCRATCH, its directors, officers, employees,
                  affiliates, agents, contractors, interns, suppliers, service
                  providers, or licensors be liable for any injury, loss, claim,
                  or any direct, indirect, incidental, punitive, special, or
                  consequential damages of any kind.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-white">
                  9. Contact Information
                </h2>
                <p className="text-[#C9BBF7] mb-6">
                  Questions about the Terms of Service should be sent to us at:
                </p>
                <div className="text-[#C9BBF7]">
                  <p>Email: legal@scratch.com</p>
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
