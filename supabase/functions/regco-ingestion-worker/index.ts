import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
  throw new Error("Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DOCUMENTS = [
  { title: "CBN AML-CFT Guidelines", source: "CBN", url: "https://www.cbn.gov.ng/Documents/AML-CFT-Guidelines.html" },
  { title: "Nigeria Data Protection Act 2023", source: "NDPC", url: "https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf" },
  { title: "NFIU Reporting Guidelines", source: "NFIU", url: "https://www.nfiu.gov.ng/images/Downloads/downloads/ReportingGuidelinesoriginalcopy2.pdf" }
];

function sanitizeText(text) {
  return text.replace(/\\/g, "").replace(/[\u0000-\u001F]/g, " ").trim();
}

function chunkText(text, chunkSize) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start = start + chunkSize;
  }
  return chunks;
}

function delay(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

async function fetchEmbedding(text) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "models/gemini-embedding-2", content: { parts: [{ text: text }] } })
    }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error("Gemini API error: " + response.status + " - " + err);
  }
  const json = await response.json();
  return json.embedding.values;
}

async function fetchDocumentText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch document: " + url + " - status " + response.status);
  }
  return await response.text();
}

serve(async function(req) {
  try {
    let totalInserted = 0;

    for (const doc of DOCUMENTS) {
      console.log("Processing: " + doc.title);

      let rawText;
      try {
        rawText = await fetchDocumentText(doc.url);
      } catch (fetchErr) {
        console.error("Fetch failed for " + doc.title + ": " + fetchErr.message);
        continue;
      }

      const chunks = chunkText(rawText, 1500);
      console.log("Chunk count for " + doc.title + ": " + chunks.length);

      for (let i = 0; i < chunks.length; i++) {
        const clean = sanitizeText(chunks[i]);
        if (!clean || clean.length < 20) {
          console.warn("Skipping short chunk " + i + " for " + doc.title);
          continue;
        }

        let embedding;
        try {
          embedding = await fetchEmbedding(clean);
        } catch (embErr) {
          console.error("Embedding error chunk " + i + " [" + doc.title + "]: " + embErr.message);
          await delay(3000);
          continue;
        }

        try {
          const { data, error } = await supabaseAdmin
            .from("knowledge_base")
            .insert({
              content: clean,
              embedding: embedding,
              metadata: { source: doc.source, title: doc.title, chunk_index: i, url: doc.url }
            })
            .select("id");

          if (error) {
            console.error("Insert error chunk " + i + " [" + doc.title + "]: " + error.message);
          } else if (!data || data.length === 0) {
            console.error("Insert returned no rows for chunk " + i + " [" + doc.title + "]");
          } else {
            totalInserted++;
          }
        } catch (insertErr) {
          console.error("Insert threw chunk " + i + " [" + doc.title + "]: " + insertErr.message);
        }

        await delay(3000);
      }

      console.log("Done: " + doc.title);
    }

    console.log("Ingestion complete. Total rows inserted: " + totalInserted);
    return new Response(
      JSON.stringify({ success: true, total_inserted: totalInserted }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );

  } catch (topErr) {
    console.error("Worker fatal error: " + topErr.message);
    return new Response(
      JSON.stringify({ success: false, error: topErr.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
