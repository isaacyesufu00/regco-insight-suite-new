import { createClient } from "https://esm.sh/@supabase/supabase-js@2 ";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const EMBED_MODEL = "models/gemini-embedding-001";
const DELAY_MS = 5000;
const BATCH_SIZE = 10;

async function getEmbedding(text) {
  const url = "https://generativelanguage.googleapis.com/v1beta/" + EMBED_MODEL + ":embedContent?key=" + GEMINI_API_KEY;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, content: { parts: [{ text: text }] } })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error("Gemini error: " + err);
  }
  const data = await res.json();
  return data.embedding.values;
}

function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

Deno.serve(async function(req) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: rows, error: fetchError } = await supabase
      .from("knowledge_base")
      .select("id, cleaned_content")
      .eq("needs_reembed", true)
      .not("cleaned_content", "is", null)
      .limit(BATCH_SIZE);
    if (fetchError) throw fetchError;
    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ message: "No rows to re-embed." }), { status: 200 });
    }
    let success = 0;
    let failed = 0;
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const vector = await getEmbedding(row.cleaned_content);
        const { error: updateError } = await supabase
          .from("knowledge_base")
          .update({ embedding: vector, needs_reembed: false })
          .eq("id", row.id);
        if (updateError) throw updateError;
        success++;
      } catch (e) {
        failed++;
        errors.push({ id: row.id, error: e.message });
      }
      if (i < rows.length - 1) { await sleep(DELAY_MS); }
    }
    return new Response(JSON.stringify({ processed: rows.length, success: success, failed: failed, errors: errors }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});