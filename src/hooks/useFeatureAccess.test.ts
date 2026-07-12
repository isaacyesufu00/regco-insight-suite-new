import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

const useProfileMock = vi.fn();

vi.mock("@/contexts/ProfileContext", () => ({
  useProfile: () => useProfileMock(),
}));

import { useFeatureAccess } from "./useFeatureAccess";

const withCategory = (licenseCategory: string) => {
  useProfileMock.mockReturnValue({ licenseCategory });
  return renderHook(() => useFeatureAccess()).result.current;
};

describe("useFeatureAccess", () => {
  beforeEach(() => {
    useProfileMock.mockReset();
  });

  it("exposes the resolved tier, label and license category", () => {
    const access = withCategory("Commercial Bank");
    expect(access.tier).toBe("commercial_bank");
    expect(access.tierLabel).toBe("Commercial Bank");
    expect(access.licenseCategory).toBe("Commercial Bank");
  });

  it("spreads the feature flags of the tier", () => {
    const access = withCategory("Unit MFB");
    expect(access.reportGeneration).toBe(true);
    expect(access.sanctionsScreening).toBe(false);
    expect(access.maxReportsPerMonth).toBe(10);
  });

  it("falls back to unit_mfb for unknown categories", () => {
    const access = withCategory("totally unknown");
    expect(access.tier).toBe("unit_mfb");
  });

  describe("canAccess", () => {
    it("returns boolean flags directly", () => {
      const access = withCategory("Unit MFB");
      expect(access.canAccess("reportGeneration")).toBe(true);
      expect(access.canAccess("sanctionsScreening")).toBe(false);
    });

    it("treats positive numeric limits as accessible", () => {
      const unit = withCategory("Unit MFB");
      expect(unit.canAccess("maxReportsPerMonth")).toBe(true);
      // maxCustomers is 0 for unit_mfb -> not accessible
      expect(unit.canAccess("maxCustomers")).toBe(false);
    });

    it("treats non-empty arrays as accessible", () => {
      const access = withCategory("Unit MFB");
      expect(access.canAccess("reportTypes")).toBe(true);
    });
  });
});
