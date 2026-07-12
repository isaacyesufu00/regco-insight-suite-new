import { describe, it, expect } from "vitest";
import {
  sanitizeText,
  sanitizeNumber,
  sanitizeEmail,
  sanitizePhone,
} from "./sanitize";

describe("sanitizeText", () => {
  it("returns empty string for null/undefined", () => {
    expect(sanitizeText(null)).toBe("");
    expect(sanitizeText(undefined)).toBe("");
  });

  it("strips HTML tags", () => {
    expect(sanitizeText("<b>hello</b>")).toBe("hello");
    expect(sanitizeText("<script>alert(1)</script>text")).toBe("alert(1)text");
  });

  it("escapes leftover special characters", () => {
    expect(sanitizeText("a & b")).toBe("a &amp; b");
    expect(sanitizeText('quote " and \' apostrophe')).toBe(
      "quote &quot; and &#39; apostrophe",
    );
  });

  it("escapes stray angle brackets that are not tags", () => {
    expect(sanitizeText("5 > 3")).toBe("5 &gt; 3");
  });

  it("trims surrounding whitespace", () => {
    expect(sanitizeText("   padded   ")).toBe("padded");
  });

  it("coerces non-string input to string", () => {
    expect(sanitizeText(42)).toBe("42");
    expect(sanitizeText(true)).toBe("true");
  });

  it("truncates output to 10000 characters", () => {
    const result = sanitizeText("a".repeat(20000));
    expect(result).toHaveLength(10000);
  });
});

describe("sanitizeNumber", () => {
  it("returns 0 for null/undefined", () => {
    expect(sanitizeNumber(null)).toBe(0);
    expect(sanitizeNumber(undefined)).toBe(0);
  });

  it("parses plain numbers", () => {
    expect(sanitizeNumber(123)).toBe(123);
    expect(sanitizeNumber("456")).toBe(456);
  });

  it("strips currency symbols and separators", () => {
    expect(sanitizeNumber("₦1,234.56")).toBe(1234.56);
    expect(sanitizeNumber("$1,000")).toBe(1000);
  });

  it("preserves negative sign", () => {
    expect(sanitizeNumber("-42")).toBe(-42);
  });

  it("returns 0 for non-numeric input", () => {
    expect(sanitizeNumber("abc")).toBe(0);
    expect(sanitizeNumber("")).toBe(0);
  });
});

describe("sanitizeEmail", () => {
  it("returns empty string for null/undefined", () => {
    expect(sanitizeEmail(null)).toBe("");
    expect(sanitizeEmail(undefined)).toBe("");
  });

  it("lowercases and trims valid emails", () => {
    expect(sanitizeEmail("  User@Example.COM ")).toBe("user@example.com");
  });

  it("rejects invalid emails", () => {
    expect(sanitizeEmail("not-an-email")).toBe("");
    expect(sanitizeEmail("missing@domain")).toBe("");
    expect(sanitizeEmail("@nolocal.com")).toBe("");
    expect(sanitizeEmail("has space@x.com")).toBe("");
  });

  it("rejects emails longer than 254 characters", () => {
    const longEmail = "a".repeat(250) + "@x.com";
    expect(sanitizeEmail(longEmail)).toBe("");
  });
});

describe("sanitizePhone", () => {
  it("returns empty string for null/undefined", () => {
    expect(sanitizePhone(null)).toBe("");
    expect(sanitizePhone(undefined)).toBe("");
  });

  it("keeps digits and common phone characters", () => {
    expect(sanitizePhone("+234 (0) 803-123-4567")).toBe(
      "+234 (0) 803-123-4567",
    );
  });

  it("strips disallowed characters", () => {
    expect(sanitizePhone("080abc12345xyz")).toBe("08012345");
  });

  it("truncates to 32 characters", () => {
    expect(sanitizePhone("1".repeat(40))).toHaveLength(32);
  });
});
