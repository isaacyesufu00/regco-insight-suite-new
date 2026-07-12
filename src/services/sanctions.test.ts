import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchSanctions } from "./sanctions";

type QueryResult = { data: unknown; error: { message: string } | null };

// Builds a chainable Supabase query-builder stub whose terminal `.limit()`
// resolves to the provided result. Every intermediate call returns `self`.
const makeSupabase = (result: QueryResult) => {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};
  const chain = (fn: string) => {
    builder[fn] = vi.fn(() =>
      fn === "limit" ? Promise.resolve(result) : builder,
    );
  };
  ["select", "eq", "ilike", "order", "limit"].forEach(chain);
  const from = vi.fn(() => builder);
  return { supabase: { from }, from, builder };
};

describe("searchSanctions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns [] when the search term is too short", async () => {
    const { supabase, from } = makeSupabase({ data: [], error: null });
    expect(await searchSanctions(supabase, "a", "inst-1")).toEqual([]);
    expect(await searchSanctions(supabase, "  ", "inst-1")).toEqual([]);
    expect(await searchSanctions(supabase, "", "inst-1")).toEqual([]);
    expect(from).not.toHaveBeenCalled();
  });

  it("returns [] and logs when institutionId is missing", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { supabase, from } = makeSupabase({ data: [], error: null });
    expect(await searchSanctions(supabase, "acme", "")).toEqual([]);
    expect(from).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it("queries the correct table with the trimmed term and returns data", async () => {
    const rows = [
      {
        matched_name: "John Doe",
        match_score: 0.9,
        watchlist_name: "OFAC",
        customer_id: "c1",
        institution_id: "inst-1",
      },
    ];
    const { supabase, from, builder } = makeSupabase({
      data: rows,
      error: null,
    });

    const result = await searchSanctions(supabase, "  John  ", "inst-1");

    expect(result).toEqual(rows);
    expect(from).toHaveBeenCalledWith("sanctions_entries");
    expect(builder.eq).toHaveBeenCalledWith("institution_id", "inst-1");
    expect(builder.ilike).toHaveBeenCalledWith("matched_name", "%John%");
    expect(builder.order).toHaveBeenCalledWith("match_score", {
      ascending: false,
    });
    expect(builder.limit).toHaveBeenCalledWith(50);
  });

  it("returns [] and logs when the query errors", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { supabase } = makeSupabase({
      data: null,
      error: { message: "boom" },
    });
    expect(await searchSanctions(supabase, "acme", "inst-1")).toEqual([]);
    expect(spy).toHaveBeenCalledWith("Sanctions search error:", "boom");
  });

  it("returns [] when data is null but there is no error", async () => {
    const { supabase } = makeSupabase({ data: null, error: null });
    expect(await searchSanctions(supabase, "acme", "inst-1")).toEqual([]);
  });
});
