import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const storageDownload = vi.fn();
const dbSingle = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: { from: () => ({ download: storageDownload }) },
    from: () => ({
      select: () => ({ eq: () => ({ single: dbSingle }) }),
    }),
  },
}));

import { downloadReport, type ReportData } from "./downloadReport";

// Capture the anchor element that downloadReport appends to trigger the
// browser download, so tests can assert on its `download` filename.
let lastAnchor: HTMLAnchorElement | null;

beforeEach(() => {
  vi.useFakeTimers();
  storageDownload.mockReset();
  dbSingle.mockReset();
  lastAnchor = null;

  // jsdom does not implement object URLs.
  (URL as unknown as { createObjectURL: unknown }).createObjectURL = vi.fn(
    () => "blob:mock",
  );
  (URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = vi.fn();

  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  const realAppend = document.body.appendChild.bind(document.body);
  vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
    if (node instanceof HTMLAnchorElement) lastAnchor = node;
    return realAppend(node);
  });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("downloadReport filename", () => {
  it("uses report_filename verbatim when provided", async () => {
    await downloadReport({ report_filename: "MyReport.txt" });
    expect(lastAnchor?.download).toBe("MyReport.txt");
  });

  it("builds a name from type, regulator and date", async () => {
    await downloadReport({ report_type: "Monthly Return", regulator: "NDIC" });
    const date = new Date().toISOString().slice(0, 10);
    expect(lastAnchor?.download).toBe(`RegCo_Monthly_Return_NDIC_${date}.txt`);
  });

  it("defaults type to 'Report' and regulator to 'CBN'", async () => {
    await downloadReport({});
    const date = new Date().toISOString().slice(0, 10);
    expect(lastAnchor?.download).toBe(`RegCo_Report_CBN_${date}.txt`);
  });

  it("forces a .txt extension on non-txt names", async () => {
    await downloadReport({ report_filename: "report.pdf" });
    expect(lastAnchor?.download).toBe("report.txt");
  });
});

describe("downloadReport callbacks and fallback", () => {
  it("invokes onStart and onComplete for the metadata fallback path", async () => {
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    // No urls / id -> synthesizes fallback content (method 5).
    await downloadReport({ report_type: "VAT" }, onStart, onComplete, onError);

    expect(onStart).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});

describe("downloadReport storage path", () => {
  it("downloads a raw storage path via the reports bucket", async () => {
    const blob = new Blob(["plain text report"], { type: "text/plain" });
    storageDownload.mockResolvedValue({ data: blob, error: null });

    const onComplete = vi.fn();
    const report: ReportData = { file_path: "inst-1/report.txt" };
    await downloadReport(report, undefined, onComplete);

    expect(storageDownload).toHaveBeenCalledWith("inst-1/report.txt");
    expect(onComplete).toHaveBeenCalledOnce();
    expect(lastAnchor).not.toBeNull();
  });

  it("uses the metadata fallback when a stored file is a binary zip/docx", async () => {
    // "PK\x03\x04" zip/docx signature -> triggers fallback text.
    const zip = new Blob([new Uint8Array([0x50, 0x4b, 0x03, 0x04])]);
    storageDownload.mockResolvedValue({ data: zip, error: null });

    const onComplete = vi.fn();
    await downloadReport({ file_path: "inst-1/report.docx" }, undefined, onComplete);

    expect(onComplete).toHaveBeenCalledOnce();
    // Falls back to a .txt download regardless of the source extension.
    expect(lastAnchor?.download.endsWith(".txt")).toBe(true);
  });
});
