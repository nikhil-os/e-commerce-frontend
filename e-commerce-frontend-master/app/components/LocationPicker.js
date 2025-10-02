"use client";
import React, { useState, useEffect } from "react";
import { LocationService } from "../utils/locationService";
import { useToast } from "../contexts/ToastContext";

export default function LocationPicker({
  onLocationChange,
  initialLocation = null,
  showAutoDetect = true,
  className = "",
}) {
  const [location, setLocation] = useState(initialLocation);
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const [useManual, setUseManual] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      if (initialLocation.address) {
        setManualAddress(initialLocation.address);
      }
    }
  }, [initialLocation]);

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    try {
      const detectedLocation = await LocationService.getLocation(true);
      setLocation(detectedLocation);
      if (detectedLocation.address) {
        setManualAddress(detectedLocation.address);
      }
      onLocationChange?.(detectedLocation);
      toast.success("📍 Location detected successfully!");
    } catch (error) {
      console.error("Location detection failed:", error);
      toast.error(`Failed to detect location: ${error.message}`);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualChange = (field, value) => {
    const updatedAddress = { ...manualAddress, [field]: value };
    setManualAddress(updatedAddress);

    const manualLocation = {
      coordinates: location?.coordinates || null,
      address: updatedAddress,
      timestamp: new Date().toISOString(),
      source: "manual",
    };

    setLocation(manualLocation);
    onLocationChange?.(manualLocation);
  };

  const getLocationDisplay = () => {
    if (!location || !location.address) return "No location selected";
    return LocationService.formatAddress(location.address);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Display */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Current Location</p>
            <p className="text-[#C9BBF7] text-sm">{getLocationDisplay()}</p>
          </div>
          {location && (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Auto-detect Button */}
      {showAutoDetect && (
        <button
          type="button"
          onClick={handleAutoDetect}
          disabled={isDetecting}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#8D7DFA] to-[#b278a8] text-white font-semibold hover:from-[#7a6aea] hover:to-[#a5689a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isDetecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Detecting Location...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Auto-Detect Location
            </>
          )}
        </button>
      )}

      {/* Manual Address Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="manual-address"
          checked={useManual}
          onChange={(e) => setUseManual(e.target.checked)}
          className="w-4 h-4 text-[#8D7DFA] bg-white/10 border-white/20 rounded focus:ring-[#8D7DFA] focus:ring-2"
        />
        <label htmlFor="manual-address" className="text-[#C9BBF7] text-sm">
          Enter address manually
        </label>
      </div>

      {/* Manual Address Fields */}
      {useManual && (
        <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-white font-medium mb-3">Enter Address Details</h4>

          <input
            type="text"
            placeholder="Street Address"
            value={manualAddress.street}
            onChange={(e) => handleManualChange("street", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-[#C9BBF7] focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City"
              value={manualAddress.city}
              onChange={(e) => handleManualChange("city", e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/10 text-white placeholder-[#C9BBF7] focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
            />
            <input
              type="text"
              placeholder="State/Province"
              value={manualAddress.state}
              onChange={(e) => handleManualChange("state", e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/10 text-white placeholder-[#C9BBF7] focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Country"
              value={manualAddress.country}
              onChange={(e) => handleManualChange("country", e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/10 text-white placeholder-[#C9BBF7] focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
            />
            <input
              type="text"
              placeholder="ZIP/Postal Code"
              value={manualAddress.zip}
              onChange={(e) => handleManualChange("zip", e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/10 text-white placeholder-[#C9BBF7] focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Location Info */}
      {location && location.coordinates && (
        <div className="text-xs text-[#C9BBF7] space-y-1 p-3 rounded-lg bg-white/5">
          <p>
            📍 Coordinates: {location.coordinates.latitude.toFixed(4)},{" "}
            {location.coordinates.longitude.toFixed(4)}
          </p>
          <p>🕒 Detected: {new Date(location.timestamp).toLocaleString()}</p>
          {location.source && (
            <p>
              📡 Source:{" "}
              {location.source === "manual" ? "Manual Entry" : "Auto-detected"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
