import { serve } from "https://deno.land/std@0.177.0/http/server.ts ";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2 ";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DOCUMENTS = [
  { title: "CBN AML-CFT Guidelines", source: "CBN", url: "https://www.cbn.gov.ng/Documents/AML-CFT-Guidelines.html " },
  { title: "Nigeria Data Protection Act 2023", source: "NDPC", url: "https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf " },
  { title: "NFIU Reporting Guidelines", source: "NFIU", url: "https://www.nfiu.gov.ng/images/Downloads/downloads/ReportingGuidelinesoriginalcopy2.pdf " }
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

async function fetchDocumentText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Fetch failed: " + url + " status " + response.status);
  }
  return await response.text();
}

serve(async function(req) {
  try {
    let totalStaged = 0;

    for (const doc of DOCUMENTS) {
      console.log("Fetching: " + doc.title);

      let rawText;
      try {
        rawText = await fetchDocumentText(doc.url);
      } catch (fetchErr) {
        console.error("Fetch failed for " + doc.title + ": " + fetchErr.message);
        continue;
      }

      const chunks = chunkText(rawText, 1500);
      console.log("Chunks for " + doc.title + ": " + chunks.length);

      for (let i = 0; i < chunks.length; i++) {
        const clean = sanitizeText(chunks[i]);
        if (!clean || clean.length < 20) {
          console.warn("Skipping short chunk " + i + " for " + doc.title);
          continue;
        }

        try {
          const { error } = await supabaseAdmin
            .from("staging_chunks")
            .insert({
              title: doc.title,
              source: doc.source,
              url: doc.url,
              chunk_index: i,
              content: clean,
              status: "pending"
            });

          if (error) {
            console.error("Staging insert error chunk " + i + " [" + doc.title + "]: " + error.message);
          } else {
            totalStaged++;
          }
        } catch (insertErr) {
          console.error("Staging insert threw chunk " + i + " [" + doc.title + "]: " + insertErr.message);
        }
      }

      console.log("Staged: " + doc.title);
    }

    console.log("Staging complete. Total rows staged: " + totalStaged);
    return new Response(
      JSON.stringify({ success: true, total_staged: totalStaged }),
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