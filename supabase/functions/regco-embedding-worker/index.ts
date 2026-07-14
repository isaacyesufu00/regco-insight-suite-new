import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.15.0";
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || "");
const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
async function embedChunk(content: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
  const result = await model.embedContent({ content: { parts: [{ text: content }] }, outputDimensionality: 1536 });
  return result.embedding.values;
}
Deno.serve(async (_req) => {
  try {
    const { data: chunks, error } = await supabaseAdmin.from("staging_chunks").select("id, content, metadata").eq("status", "pending").limit(9);
    if (error) throw error;
    if (!chunks || chunks.length === 0) return new Response(JSON.stringify({ processed: 0 }), { status: 200 });
    let processed = 0;
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await supabaseAdmin.from("staging_chunks").update({ status: "processing" }).eq("id", chunk.id);
      const embedding = await embedChunk(chunk.content);
      await supabaseAdmin.from("knowledge_base").insert({ content: chunk.content, embedding: embedding, metadata: chunk.metadata || {} });
      await supabaseAdmin.from("staging_chunks").update({ status: "done" }).eq("id", chunk.id);
      processed++;
    }
    return new Response(JSON.stringify({ processed: processed }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
