"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
