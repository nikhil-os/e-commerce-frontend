"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <>
      <Header user={user} onLogout={logout} />
      {children}
      <Footer />
    </>
  );
}
