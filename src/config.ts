/**
 * Landing page configuration
 * Update these values for your deployment
 */

export const CONFIG = {
  /** URL of the main app (for "Войти" / profile links) */
  APP_URL: import.meta.env.VITE_APP_URL || "https://meet.naura.app",

  /** URL to start meetings (bot link or quiz) */
  START_MEETINGS_URL: import.meta.env.VITE_START_MEETINGS_URL || "",

  /** Telegram manager username for B2B inquiries */
  TELEGRAM_MANAGER: "@naura_meet_manager",

  /** Support email */
  SUPPORT_EMAIL: "support@naura.meet",

  /** Legal URLs */
  LEGAL: {
    PRIVACY_POLICY: "https://naurameet.com/privacy",
    TERMS_OF_SERVICE: "https://naurameet.com/terms",
  },
} as const;

export function buildTelegramLink(usernameOrLink: string): string {
  const trimmed = usernameOrLink.trim();
  if (!trimmed) return "https://t.me/";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.includes("t.me/")) return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  const clean = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return `https://t.me/${clean}`;
}

export function buildMailtoLink(params: { to: string; subject: string; body: string }): string {
  return `mailto:${encodeURIComponent(params.to)}?subject=${encodeURIComponent(params.subject)}&body=${encodeURIComponent(params.body)}`;
}
