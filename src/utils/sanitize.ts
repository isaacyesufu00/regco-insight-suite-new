// Lightweight input sanitization helpers used on all user-facing forms before
// values reach the database or any outbound request.

const HTML_ENTITIES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  '"': "&quot;",
  "'": "&#39;",
};

export const sanitizeText = (input: unknown): string => {
  if (input === null || input === undefined) return "";
  const str = String(input);
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/[<>&"']/g, (c) => HTML_ENTITIES[c] || c)
    .trim()
    .slice(0, 10000);
};

export const sanitizeNumber = (input: unknown): number => {
  if (input === null || input === undefined) return 0;
  const n = Number(String(input).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export const sanitizeEmail = (input: unknown): string => {
  if (input === null || input === undefined) return "";
  const email = String(input).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254 ? email : "";
};

export const sanitizePhone = (input: unknown): string => {
  if (input === null || input === undefined) return "";
  return String(input).replace(/[^\d+\s()-]/g, "").trim().slice(0, 32);
};
