"use client";

import React from "react";
import Layout from "../components/Layout";

export default function Careers() {
  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Join the <span className="text-[#8D7DFA]">SCRATCH</span> Team
              </h1>
              <p className="text-xl text-[#C9BBF7] max-w-2xl mx-auto">
                Be part of our innovative e-commerce journey. We&apos;re looking
                for passionate individuals who want to shape the future of
                online fashion retail.
              </p>
            </div>

            {/* Career Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Frontend Developer
                </h3>
                <p className="text-[#C9BBF7] mb-4">
                  Join our development team to create amazing user experiences
                  using React, Next.js, and modern web technologies.
                </p>
                <div className="text-sm text-[#C9BBF7] opacity-80 mb-4">
                  Location: Remote • Full-time
                </div>
                <button className="btn btn-primary">Apply Now</button>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  UI/UX Designer
                </h3>
                <p className="text-[#C9BBF7] mb-4">
                  Design beautiful, intuitive interfaces that delight our
                  customers and drive engagement across our platform.
                </p>
                <div className="text-sm text-[#C9BBF7] opacity-80 mb-4">
                  Location: Remote • Full-time
                </div>
                <button className="btn btn-primary">Apply Now</button>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Product Manager
                </h3>
                <p className="text-[#C9BBF7] mb-4">
                  Lead product strategy and development, working closely with
                  engineering and design teams to deliver exceptional features.
                </p>
                <div className="text-sm text-[#C9BBF7] opacity-80 mb-4">
                  Location: Hybrid • Full-time
                </div>
                <button className="btn btn-primary">Apply Now</button>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Marketing Specialist
                </h3>
                <p className="text-[#C9BBF7] mb-4">
                  Drive growth through creative marketing campaigns, social
                  media strategy, and customer engagement initiatives.
                </p>
                <div className="text-sm text-[#C9BBF7] opacity-80 mb-4">
                  Location: Remote • Full-time
                </div>
                <button className="btn btn-primary">Apply Now</button>
              </div>
            </div>

            {/* Why Work With Us */}
            <div className="glass-card p-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Choose SCRATCH?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Innovation First
                  </h3>
                  <p className="text-[#C9BBF7]">
                    Work with cutting-edge technologies and contribute to
                    groundbreaking features.
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Growth Opportunities
                  </h3>
                  <p className="text-[#C9BBF7]">
                    Continuous learning, mentorship, and career advancement in a
                    fast-growing company.
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-4">💜</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Great Culture
                  </h3>
                  <p className="text-[#C9BBF7]">
                    Join a diverse, inclusive team that values creativity,
                    collaboration, and work-life balance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
