import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollToTop
 *
 * Two behaviours in one component:
 *
 * 1. ROUTE CHANGE — scroll to top whenever the pathname changes (navigating
 *    between pages). This is standard SPA behaviour.
 *
 * 2. PAGE REFRESH — browsers implement "scroll restoration": when you hit F5
 *    or Cmd+R, the browser saves the scroll position in the session history
 *    entry and restores it after the page reloads. This causes the "stuck at
 *    the same position on refresh" bug.
 *
 *    Fix: set `history.scrollRestoration = "manual"` so the browser never
 *    auto-restores the scroll position. We then scroll to (0,0) ourselves on
 *    every mount, which fires both on first load AND on refresh.
 *
 *    NOTE: This must be set before the browser has a chance to restore scroll,
 *    so we do it at module evaluation time (outside the component) as well as
 *    inside the effect.
 */

// Disable browser scroll restoration immediately when this module loads.
// This runs before React renders, giving us the earliest possible hook.
if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Belt-and-suspenders: also set it here in case the module-level code
    // ran before `history` was available in some SSR/edge environment.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Scroll to the top of the page.
    // `{ behavior: "instant" }` avoids a visible smooth-scroll on navigation.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}