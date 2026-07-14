import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Single-page apps keep the previous scroll position when navigating, so
 * opening a new page could land the visitor at the footer. This scrolls
 * back to the top on every route change.
 */
export default function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}
