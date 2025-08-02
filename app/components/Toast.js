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
          bg: "bg-gradient-to-r from-[#8f6690] to-[#b278a8]", // Website theme colors
          icon: "✅",
          iconColor: "text-green-400", // Green only for the icon
          progressBar: "bg-green-400",
          borderColor: "border-green-400/30",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-[#8f6690] to-[#b278a8]", // Website theme colors
          icon: "❌",
          iconColor: "text-red-400", // Red only for the icon
          progressBar: "bg-red-400",
          borderColor: "border-red-400/30",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-[#8f6690] to-[#b278a8]", // Website theme colors
          icon: "⚠️",
          iconColor: "text-yellow-400", // Yellow only for the icon
          progressBar: "bg-yellow-400",
          borderColor: "border-yellow-400/30",
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-[#8f6690] to-[#b278a8]", // Website theme colors
          icon: "ℹ️",
          iconColor: "text-blue-400", // Blue only for the icon
          progressBar: "bg-blue-400",
          borderColor: "border-blue-400/30",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-[#8f6690] to-[#b278a8]", // Website theme colors
          icon: "🎉",
          iconColor: "text-[#C9BBF7]", // Website accent color
          progressBar: "bg-[#C9BBF7]",
          borderColor: "border-[#C9BBF7]/30",
        };
    }
  };

  const colors = getToastColors();

  return (
    <div className={getToastStyles()}>
      <div
        className={`${colors.bg} text-white p-4 rounded-xl shadow-2xl backdrop-blur-sm border-2 ${colors.borderColor} min-w-[320px] max-w-full relative overflow-hidden`}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-xl"></div>

        <div className="relative z-10 flex items-start gap-4 min-h-[24px]">
          <div
            className={`text-2xl flex-shrink-0 mt-0.5 leading-none ${colors.iconColor} drop-shadow-lg`}
          >
            {colors.icon}
          </div>
          <p className="font-medium text-sm leading-[1.4] flex-1 min-w-0 break-words whitespace-pre-wrap py-0.5 text-white/95">
            {message}
          </p>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose && onClose(), 300);
            }}
            className="text-white/70 hover:text-white transition-colors duration-200 text-xl leading-none flex-shrink-0 ml-2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 backdrop-blur-sm"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className={`h-full ${colors.progressBar} transition-all duration-50 ease-linear rounded-full shadow-sm`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;
