/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "border-spin": {
          "0%": { transform: "rotate(0deg) scaleX(1) scaleY(1)" },
          "100%": { transform: "rotate(-90deg) scaleX(1.34) scaleY(0.77)" },
        },
        // Fade animations
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Scale animations
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleInRotate: {
          "0%": { opacity: "0", transform: "scale(0.8) rotate(-10deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        // Slide animations
        slideInUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInDown: {
          "0%": { opacity: "0", transform: "translateY(-100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Bounce animations
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceInUp: {
          "0%": { opacity: "0", transform: "translateY(100px) scale(0.8)" },
          "60%": { opacity: "1", transform: "translateY(-10px) scale(1.1)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // Rotation animations
        rotateIn: {
          "0%": { opacity: "0", transform: "rotate(-200deg) scale(0.8)" },
          "100%": { opacity: "1", transform: "rotate(0deg) scale(1)" },
        },
        // Flip animations
        flipInX: {
          "0%": {
            opacity: "0",
            transform: "perspective(400px) rotateX(90deg)",
          },
          "40%": { transform: "perspective(400px) rotateX(-20deg)" },
          "60%": { transform: "perspective(400px) rotateX(10deg)" },
          "80%": { transform: "perspective(400px) rotateX(-5deg)" },
          "100%": {
            opacity: "1",
            transform: "perspective(400px) rotateX(0deg)",
          },
        },
        flipInY: {
          "0%": {
            opacity: "0",
            transform: "perspective(400px) rotateY(90deg)",
          },
          "40%": { transform: "perspective(400px) rotateY(-20deg)" },
          "60%": { transform: "perspective(400px) rotateY(10deg)" },
          "80%": { transform: "perspective(400px) rotateY(-5deg)" },
          "100%": {
            opacity: "1",
            transform: "perspective(400px) rotateY(0deg)",
          },
        },
        // Special animations
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 157, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 107, 157, 0.6)" },
        },
        floating: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "border-spin": "border-spin 6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        // Fade animations
        fadeIn: "fadeIn 0.6s ease-out forwards",
        fadeInUp: "fadeInUp 0.7s ease-out forwards",
        fadeInDown: "fadeInDown 0.7s ease-out forwards",
        fadeInLeft: "fadeInLeft 0.7s ease-out forwards",
        fadeInRight: "fadeInRight 0.7s ease-out forwards",
        // Scale animations
        scaleIn: "scaleIn 0.5s ease-out forwards",
        scaleInRotate: "scaleInRotate 0.8s ease-out forwards",
        // Slide animations
        slideInUp: "slideInUp 0.8s ease-out forwards",
        slideInDown: "slideInDown 0.8s ease-out forwards",
        slideInLeft: "slideInLeft 0.8s ease-out forwards",
        slideInRight: "slideInRight 0.8s ease-out forwards",
        // Bounce animations
        bounceIn: "bounceIn 1s ease-out forwards",
        bounceInUp: "bounceInUp 1s ease-out forwards",
        // Rotation animations
        rotateIn: "rotateIn 0.8s ease-out forwards",
        // Flip animations
        flipInX: "flipInX 0.8s ease-out forwards",
        flipInY: "flipInY 0.8s ease-out forwards",
        // Special animations
        glowPulse: "glowPulse 2s ease-in-out infinite",
        floating: "floating 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
