// Location Service Utility
export class LocationService {
  static async getCurrentLocation(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
      ...options,
    };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const address = await this.reverseGeocode(latitude, longitude);
            resolve({
              coordinates: { latitude, longitude },
              address,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            resolve({
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              address: null,
              timestamp: new Date().toISOString(),
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        defaultOptions
      );
    });
  }

  static async getLocationByIP() {
    try {
      // Using free IP geolocation service
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.reason || "IP location service error");
      }

      return {
        coordinates: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        address: {
          street: "",
          city: data.city || "",
          state: data.region || "",
          country: data.country_name || "",
          zip: data.postal || "",
          formatted: `${data.city}, ${data.region}, ${data.country_name}`,
        },
        ip: data.ip,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("IP location error:", error);
      throw error;
    }
  }

  static async reverseGeocode(latitude, longitude) {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();

      return {
        street: data.locality || "",
        city: data.city || data.principalSubdivision || "",
        state: data.principalSubdivision || "",
        country: data.countryName || "",
        zip: data.postcode || "",
        formatted: data.locality
          ? `${data.locality}, ${data.city}, ${data.principalSubdivision}, ${data.countryName}`
          : `${data.city}, ${data.principalSubdivision}, ${data.countryName}`,
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  }

  static async getLocation(preferGPS = true) {
    if (preferGPS) {
      try {
        return await this.getCurrentLocation();
      } catch (gpsError) {
        console.warn(
          "GPS location failed, falling back to IP location:",
          gpsError.message
        );
        try {
          return await this.getLocationByIP();
        } catch (ipError) {
          console.error("Both GPS and IP location failed:", ipError.message);
          throw new Error("Unable to determine location");
        }
      }
    } else {
      try {
        return await this.getLocationByIP();
      } catch (ipError) {
        console.warn("IP location failed, trying GPS:", ipError.message);
        return await this.getCurrentLocation();
      }
    }
  }

  static formatAddress(address) {
    if (!address) return "";

    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
    ].filter(Boolean);

    return parts.join(", ");
  }

  static validateLocation(location) {
    if (!location || !location.coordinates) {
      return false;
    }

    const { latitude, longitude } = location.coordinates;
    return (
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }
}

export default LocationService;
