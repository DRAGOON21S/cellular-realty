// Automatic lead-form pop-up settings (spec §2.3).
// Centralized here rather than hard-coded in the component so timing/threshold
// can be tuned without touching logic.
export const popupConfig = {
  /** Master switch for the automatic pop-up. */
  enabled: true,
  /** Open after this many ms of active browsing. */
  delayMs: 35_000,
  /** …or when the user scrolls past this fraction of the page (0–1). */
  scrollThreshold: 0.85,
} as const;
