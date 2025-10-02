// Animation CSS classes
export const animationClasses = {
  // Fade animations
  fadeIn: "animate-fadeIn",
  fadeInUp: "animate-fadeInUp",
  fadeInDown: "animate-fadeInDown",
  fadeInLeft: "animate-fadeInLeft",
  fadeInRight: "animate-fadeInRight",

  // Scale animations
  scaleIn: "animate-scaleIn",
  scaleInRotate: "animate-scaleInRotate",

  // Slide animations
  slideInUp: "animate-slideInUp",
  slideInDown: "animate-slideInDown",
  slideInLeft: "animate-slideInLeft",
  slideInRight: "animate-slideInRight",

  // Bounce animations
  bounceIn: "animate-bounceIn",
  bounceInUp: "animate-bounceInUp",

  // Rotation animations
  rotateIn: "animate-rotateIn",

  // Flip animations
  flipInX: "animate-flipInX",
  flipInY: "animate-flipInY",

  // Special animations
  glowPulse: "animate-glowPulse",
  floating: "animate-floating",
  shimmer: "animate-shimmer",
};

// Base animation component
export const AnimatedSection = ({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration = "duration-700",
  className = "",
  triggerOnce = false,
}) => {
  const [ref, isVisible] = useScrollAnimation({ triggerOnce });

  return (
    <div
      ref={ref}
      className={`
        ${className}
        ${isVisible ? animationClasses[animation] : "opacity-0 translate-y-8"}
        ${duration}
        transition-all ease-out
      `}
      style={{
        animationDelay: `${delay}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
