import React from "react";
import Layout from "../components/Layout";

const team = [
  {
    name: "Nikhil Sahu",
    role: "Founder & CEO",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Lead Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Raj Patel",
    role: "Head of Engineering",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

export default function AboutPage() {
  return (
    <Layout>
      <section className="relative flex items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <div className="mb-10 text-center">
              <h1 className="mb-4">About SCRATCH</h1>
              <p className="text-[#C9BBF7] text-lg mb-6">
                Welcome to{" "}
                <span className="font-semibold text-white">SCRATCH</span> — your
                ultimate destination for stylish fashion and lifestyle
                essentials, inspired by the wonders of the universe.
              </p>
              <p className="text-[#C9BBF7] mb-6">
                Our mission is to bring you handpicked clothing, accessories,
                and luxury pieces with a seamless, cosmic shopping experience.
                From trendsetting looks to timeless classics, every product is
                chosen to help you express your unique style.
              </p>
            </div>
            <div className="mb-10">
              <h2 className="mb-6 text-2xl font-bold text-center text-white">
                Meet Our Team
              </h2>
              <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
                {team.map((member) => (
                  <div key={member.name} className="flex flex-col items-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full shadow-lg mb-2 border-4 border-[#8D7DFA]"
                    />
                    <div className="font-semibold text-white">
                      {member.name}
                    </div>
                    <div className="text-[#C9BBF7] text-sm">{member.role}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Our Cosmic Promise
              </h2>
              <p className="text-[#C9BBF7] max-w-xl mx-auto mb-4">
                We are passionate about delivering a stellar experience — from
                the moment you land on our site to the day your cosmic package
                arrives at your door. Thank you for being part of our journey
                among the stars!
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <span className="inline-block px-4 py-2 rounded-full bg-[#8D7DFA] text-white font-semibold shadow hover:bg-[#9E91FF] transition">
                  🚀 Dream Big
                </span>
                <span className="inline-block px-4 py-2 rounded-full bg-[#C9BBF7] text-[#3A3159] font-semibold shadow hover:bg-[#8D7DFA] hover:text-white transition">
                  🌌 Shop Cosmic
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
