import { describe, it, expect } from "vitest";
import {
  FEATURE_TIERS,
  TIER_LABEL,
  getTier,
  getFeatures,
} from "./featureTiers";

describe("getTier", () => {
  it("maps keywords to the correct tier", () => {
    expect(getTier("Unit Microfinance Bank")).toBe("unit_mfb");
    expect(getTier("State MFB")).toBe("state_mfb");
    expect(getTier("National MFB")).toBe("national_mfb");
    expect(getTier("Commercial Bank")).toBe("commercial_bank");
    expect(getTier("Primary Mortgage Bank")).toBe("pmb");
    expect(getTier("pmb")).toBe("pmb");
    expect(getTier("Finance Company")).toBe("finance_company");
    expect(getTier("Fintech")).toBe("finance_company");
  });

  it("is case-insensitive", () => {
    expect(getTier("COMMERCIAL")).toBe("commercial_bank");
    expect(getTier("national")).toBe("national_mfb");
  });

  it("defaults to unit_mfb for unknown or empty input", () => {
    expect(getTier("")).toBe("unit_mfb");
    expect(getTier("something else")).toBe("unit_mfb");
    expect(getTier(undefined as unknown as string)).toBe("unit_mfb");
  });

  it("prioritizes 'national' over generic matches", () => {
    expect(getTier("National Microfinance")).toBe("national_mfb");
  });
});

describe("getFeatures", () => {
  it("returns the feature set for the resolved tier", () => {
    expect(getFeatures("Commercial Bank")).toBe(FEATURE_TIERS.commercial_bank);
    expect(getFeatures("Unit MFB")).toBe(FEATURE_TIERS.unit_mfb);
  });

  it("returns unit_mfb features for unknown categories", () => {
    expect(getFeatures("unknown")).toBe(FEATURE_TIERS.unit_mfb);
  });

  it("reflects tier-specific limits", () => {
    expect(getFeatures("Unit MFB").maxReportsPerMonth).toBe(10);
    expect(getFeatures("Commercial Bank").maxReportsPerMonth).toBe(999);
    expect(getFeatures("Unit MFB").sanctionsScreening).toBe(false);
    expect(getFeatures("Commercial Bank").sanctionsScreening).toBe(true);
  });
});

describe("FEATURE_TIERS / TIER_LABEL integrity", () => {
  it("has a label for every tier", () => {
    for (const key of Object.keys(FEATURE_TIERS)) {
      expect(TIER_LABEL[key]).toBeTruthy();
    }
  });

  it("defines all feature flags for every tier", () => {
    const keys = Object.keys(FEATURE_TIERS.unit_mfb).sort();
    for (const tier of Object.values(FEATURE_TIERS)) {
      expect(Object.keys(tier).sort()).toEqual(keys);
    }
  });

  it("has non-negative numeric limits", () => {
    for (const tier of Object.values(FEATURE_TIERS)) {
      expect(tier.maxReportsPerMonth).toBeGreaterThanOrEqual(0);
      expect(tier.maxCustomers).toBeGreaterThanOrEqual(0);
      expect(tier.maxTransactionsPerUpload).toBeGreaterThanOrEqual(0);
      expect(tier.maxUsersAllowed).toBeGreaterThanOrEqual(1);
    }
  });
});
