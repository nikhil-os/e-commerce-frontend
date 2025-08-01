"use client";
import React, { useState, useEffect } from "react";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - 100 / (duration / 50); // Update every 50ms
      });
    }, 50);

    // Auto hide toast
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles =
      "w-full transform transition-all duration-300 ease-in-out";

    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    return `${baseStyles} translate-x-0 opacity-100`;
  };

  const getToastColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-500 to-emerald-600",
          icon: "✅",
          progressBar: "bg-green-300",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-rose-600",
          icon: "❌",
          progressBar: "bg-red-300",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
          icon: "⚠️",
          progressBar: "bg-yellow-300",
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
          icon: "ℹ️",
          progressBar: "bg-blue-300",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-[#8f6690] to-[#b278a8]",
          icon: "🎉",
          progressBar: "bg-purple-300",
        };
    }
  };

  const colors = getToastColors();

  return (
    <div className={getToastStyles()}>
      <div
        className={`${colors.bg} text-white p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 min-w-[280px] max-w-full`}
      >
        <div className="flex items-start gap-3 min-h-[24px]">
          <span className="text-xl flex-shrink-0 mt-0.5 leading-none">
            {colors.icon}
          </span>
          <p className="font-medium text-sm leading-[1.4] flex-1 min-w-0 break-words whitespace-pre-wrap py-0.5">
            {message}
          </p>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose && onClose(), 300);
            }}
            className="text-white/80 hover:text-white transition-colors duration-200 text-xl leading-none flex-shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.progressBar} transition-all duration-50 ease-linear rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;
