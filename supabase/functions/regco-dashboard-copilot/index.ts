import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || "";
const OPENROUTER_MODEL = Deno.env.get("AI_MODEL_ID") || "openrouter/owl-alpha";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function safeJsonParse(text) {
  try { return { ok: true, value: JSON.parse(text) }; }
  catch (_err) { return { ok: false, value: null }; }
}

function normalizeContextRows(rows) {
  if (!rows || !Array.isArray(rows)) return [];
  return rows.map((row) => ({
    id: row.id || null,
    content: row.content || "",
    metadata: row.metadata || {}
  }));
}

function buildContextText(rows) {
  if (!rows.length) return "";
  return rows.map((row, index) => "Source " + (index + 1) + ":\n" + row.content).join("\n\n---\n\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
      }
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const body = await req.json();
    const prompt = body.prompt || "";
    const taskType = body.task_type || "copilot";
    const institutionId = body.institution_id || null;
    const queryEmbedding = body.query_embedding || null;
    const extraContext = body.extra_context || "";

    if (!prompt) {
      return new Response(JSON.stringify({ ok: false, error: "Missing prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    let knowledgeRows = [];
    if (Array.isArray(queryEmbedding) && queryEmbedding.length === 1536) {
      const searchResult = await supabaseAdmin.rpc("match_knowledge_base", {
        query_embedding: queryEmbedding,
        match_threshold: 0.45,
        match_count: 5
      });
      if (!searchResult.error && searchResult.data) {
        knowledgeRows = normalizeContextRows(searchResult.data);
      }
    }

    const contextText = buildContextText(knowledgeRows);

    const systemPrompt = "You are RegCo Dashboard Copilot. You help users generate compliance reports, draft documents, write summaries, and produce chart-ready analytics.\n\nReturn only valid JSON with these keys: response_text, title, task_type, charts, tables, citations, actions, summary.\n\nChart objects: type, title, x_label, y_label, series, data. If no charts requested, return empty array. Groundanswers in context. No backticks.";

    const userPrompt = "Task Type: " + taskType + "\nInstitution Id: " + (institutionId || "none") + "\n\nUser Request:\n" + prompt + "\n\n" + (extraContext ? "Extra Context:\n" + extraContext + "\n\n" : "") + (contextText ? "Knowledge Base Context:\n" + contextText + "\n\n" : "") + "Answer in JSON only.";

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2
      })
    });

    const aiData = await aiResponse.json();
    const rawContent = aiData && aiData.choices && aiData.choices[0] && aiData.choices[0].message ? aiData.choices[0].message.content : "";
    const parsed = safeJsonParse(rawContent);
    const result = parsed.ok ? parsed.value : {
      response_text: rawContent,
      title: "Copilot Result",
      task_type: taskType,
      charts: [],
      tables: [],
      citations: [],
      actions: [],
      summary: rawContent
    };

    return new Response(JSON.stringify({ ok: true, result: result, sources: knowledgeRows, model: OPENROUTER_MODEL }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err && err.message ? err.message : "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});