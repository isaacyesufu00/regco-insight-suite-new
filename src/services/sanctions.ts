export async function searchSanctions(
  supabase: any,
  searchTerm: string,
  institutionId: string
): Promise<SanctionsEntry[]> {

  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  if (!institutionId) {
    console.error('Sanctions search error: institutionId is required');
    return [];
  }

  const sanitizedTerm = searchTerm.trim();

  const { data, error } = await supabase
    .from('sanctions_entries')
    .select('matched_name, match_score, watchlist_name, customer_id, institution_id')
    .eq('institution_id', institutionId)
    .ilike('matched_name', '%' + sanitizedTerm + '%')
    .order('match_score', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Sanctions search error:', error.message);
    return [];
  }

  return data || [];
}


also add this type above the function so TypeScript knows exactly what comes back:


export type SanctionsEntry = {
  matched_name: string;
  match_score: number;
  watchlist_name: string;
  customer_id: string;
  institution_id: string;
};


and run this once in your Supabase SQL editor to enable the fast trigram index:


CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_sanctions_name_trgm
ON sanctions_entries
USING GIN (matched_name gin_trgm_ops);
