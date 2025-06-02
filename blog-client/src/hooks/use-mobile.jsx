import * as React from "react";

// Define mobile breakpoint constant
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current screen width is mobile.
 * Returns `true` if the window width is less than MOBILE_BREAKPOINT.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Initial check
    handleResize();

    // Add listener
    mediaQuery.addEventListener("change", handleResize);

    // Clean up listener on unmount
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return isMobile;
}
