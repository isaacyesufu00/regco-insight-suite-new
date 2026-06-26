export async function searchSanctions(
  supabase: any,
  searchTerm: string,
  institutionId: string,
): Promise<SanctionsEntry[]> {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  if (!institutionId) {
    console.error("Sanctions search error: institutionId is required");
    return [];
  }

  const sanitizedTerm = searchTerm.trim();

  const { data, error } = await supabase
    .from("sanctions_entries")
    .select("matched_name, match_score, watchlist_name, customer_id, institution_id")
    .eq("institution_id", institutionId)
    .ilike("matched_name", "%" + sanitizedTerm + "%")
    .order("match_score", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Sanctions search error:", error.message);
    return [];
  }

  return data || [];
}
export type SanctionsEntry = {
  matched_name: string;
  match_score: number;
  watchlist_name: string;
  customer_id: string;
  institution_id: string;
};
