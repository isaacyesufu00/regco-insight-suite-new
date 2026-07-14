import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const openRouterKey = Deno.env.get("OPENROUTER_API_KEY") || "";
const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    const payload = await req.json();
    const { transaction_id, summary, amount, currency, counterparty, institution_id } = payload;

    if (!summary || !institution_id || !transaction_id) {
      return new Response(JSON.stringify({ error: "Missing transaction_id, summary, or institution_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=" + geminiApiKey;
    
    const embeddingResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: {
          parts: [{ text: summary }]
        }
      })
    });

    if (!embeddingResponse.ok) {
      throw new Error("Gemini API embedding generation failed");
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.embedding.values;

    const { data: documents, error: matchError } = await supabaseAdmin.rpc("match_knowledge_base", {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 5
    });

    if (matchError) {
      throw new Error("Database vector match error: " + matchError.message);
    }

    let regulatoryContext = "";
    const sourceDocumentIds = [];

    if (documents && documents.length > 0) {
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        regulatoryContext += "Source: " + doc.document_title + " (" + doc.regulator + ")\nContent: " + doc.content + "\n\n";
        if (doc.id) {
          sourceDocumentIds.push(doc.id);
        }
      }
    }

    const systemPrompt = "You are OWL, the regulatory compliance engine. Analyze the transaction details against the provided regulatory context. You must return a structured JSON object with exactly two keys: 'decision' (which must be exactly 'APPROVE', 'FLAG', or 'REJECT') and 'justification' (a JSON object mapping rules analyzed to clear justifications). Output raw JSON only. Do not wrap in markdown or markdown code blocks.";

    const userMessage = "Transaction details:\n" +
      "ID: " + transaction_id + "\n" +
      "Amount: " + amount + " " + currency + "\n" +
      "Counterparty: " + counterparty + "\n" +
      "Summary: " + summary + "\n\n" +
      "Regulatory Context:\n" +
      regulatoryContext;

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + openRouterKey
      },
      body: JSON.stringify({
        model: "openrouter/owl-alpha",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!openRouterResponse.ok) {
      throw new Error("OpenRouter decision logic failed");
    }

    const openRouterData = await openRouterResponse.json();
    const rawChoice = openRouterData.choices[0].message.content.trim();
    
    const parsedDecision = JSON.parse(rawChoice);
    const finalDecision = parsedDecision.decision;
    const finalJustification = parsedDecision.justification;

    const { data: decisionRow, error: insertError } = await supabaseAdmin
      .from("aml_decisions")
      .insert({
        institution_id: institution_id,
        transaction_id: transaction_id,
        decision: finalDecision,
        justification: finalJustification,
        source_document_ids: sourceDocumentIds
      })
      .select()
      .single();

    if (insertError) {
      throw new Error("Database insertion error: " + insertError.message);
    }

    return new Response(JSON.stringify(decisionRow), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
