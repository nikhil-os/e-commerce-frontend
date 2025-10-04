"use client";

import { useEffect, useRef, useState } from "react";

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const { threshold = 0.1, triggerOnce = false, rootMargin = "0px" } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          setIsVisible(true);
          if (!triggerOnce) {
            setHasAnimated(true);
          }
        } else {
          if (!triggerOnce) {
            setIsVisible(false);
            setHasAnimated(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, triggerOnce, rootMargin]);

  return [ref, isVisible, hasAnimated];
};

export const useMultipleScrollAnimations = (count, options = {}) => {
  const refs = useRef([]);
  const [visibilityStates, setVisibilityStates] = useState(
    new Array(count).fill(false)
  );

  const {
    threshold = 0.1,
    triggerOnce = false,
    rootMargin = "0px",
    staggerDelay = 100,
  } = options;

  useEffect(() => {
    refs.current = refs.current.slice(0, count);
    for (let i = refs.current.length; i < count; i++) {
      refs.current[i] = React.createRef();
    }
  }, [count]);

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref.current) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibilityStates((prev) => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
              });
            }, index * staggerDelay);
          } else if (!triggerOnce) {
            setVisibilityStates((prev) => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(ref.current);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && refs.current[index]?.current) {
          observer.unobserve(refs.current[index].current);
        }
      });
    };
  }, [count, threshold, triggerOnce, rootMargin, staggerDelay]);

  return [refs.current, visibilityStates];
};
