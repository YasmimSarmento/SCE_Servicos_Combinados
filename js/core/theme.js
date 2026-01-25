// Global theme controller (light/dark) for entire system
// - Applies theme by toggling `html.theme-dark`
// - Persists in localStorage key `appTheme_v1`
// - Backwards compatibility: reads `dashboardTheme` if present
(function () {
  const KEY = "appTheme_v1";
  const LEGACY_KEY = "dashboardTheme";

  function safeGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function safeSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }

  function apply(theme) {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("theme-dark");
    else root.classList.remove("theme-dark");
  }

  function getPreferred() {
    const v = safeGet(KEY);
    if (v === "dark" || v === "light") return v;

    const legacy = safeGet(LEGACY_KEY);
    if (legacy === "dark" || legacy === "light") return legacy;

    // Default: light (safe & predictable)
    return "light";
  }

  function set(theme) {
    const next = theme === "dark" ? "dark" : "light";
    safeSet(KEY, next);
    // keep legacy in sync so older pages (if any) still behave
    safeSet(LEGACY_KEY, next);
    apply(next);
    return next;
  }

  function toggle() {
    const isDark = document.documentElement.classList.contains("theme-dark");
    return set(isDark ? "light" : "dark");
  }

  // Apply ASAP
  apply(getPreferred());

  // Expose minimal API
  window.__theme = {
    get: () => (document.documentElement.classList.contains("theme-dark") ? "dark" : "light"),
    set,
    toggle
  };
})();
