import { createClient } from 'npm:@supabase/supabase-js@2';

// Fail-closed CORS: only reflect the configured production origin.
// Set CORS_ALLOWED_ORIGIN in Supabase function env to the Vercel domain.
function corsHeaders(req: Request): HeadersInit {
  const allowed = Deno.env.get("CORS_ALLOWED_ORIGIN");
  const origin = req.headers.get("origin");
  const allow = allowed && origin === allowed ? allowed : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const fmtNGN = (n: number) => '₦' + Number(n || 0).toLocaleString('en-NG');
const pad = (s: string, w = 50) => s + ' '.repeat(Math.max(0, w - s.length));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Verify caller identity from JWT
    const anonClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await anonClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401, headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const month: string = body.month || new Date().toISOString().slice(0, 7);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    // Insert a "generating" placeholder
    const { data: insertRow, error: insertErr } = await admin.from('compliance_reports').insert({
      user_id: userId, month, status: 'generating',
    }).select('id').single();
    if (insertErr) throw insertErr;
    const reportId = insertRow.id;

    // Period bounds
    const periodStart = `${month}-01`;
    const periodEndDate = new Date(`${month}-01T00:00:00Z`);
    periodEndDate.setUTCMonth(periodEndDate.getUTCMonth() + 1);
    const periodEnd = periodEndDate.toISOString().slice(0, 10);

    // Fetch data in parallel
    const [
      { data: profile },
      { data: reportsData },
      { data: txReviews },
      { data: screening },
      { data: kyc },
      { data: customers },
      { data: tasks },
    ] = await Promise.all([
      admin.from('profiles').select('*').eq('id', userId).maybeSingle(),
      admin.from('reports').select('id,status,regulator,report_type,generated_at,created_at')
        .eq('user_id', userId).gte('created_at', periodStart).lt('created_at', periodEnd),
      admin.from('transaction_reviews').select('flag_severity,status')
        .eq('user_id', userId).gte('created_at', periodStart).lt('created_at', periodEnd),
      admin.from('screening_results').select('highest_risk,matches_found')
        .eq('user_id', userId).gte('created_at', periodStart).lt('created_at', periodEnd),
      admin.from('customer_kyc').select('kyc_status').eq('user_id', userId),
      admin.from('customers').select('id').eq('user_id', userId),
      admin.from('monthly_compliance_tasks').select('status,title').eq('user_id', userId).eq('month', month),
    ]);

    const reports = reportsData || [];
    const reportsReady = reports.filter((r: any) => ['ready', 'submitted', 'filed'].includes(String(r.status).toLowerCase())).length;
    const reportsFailed = reports.filter((r: any) => String(r.status).toLowerCase() === 'failed').length;

    const tr = txReviews || [];
    const criticalFlags = tr.filter((t: any) => t.flag_severity === 'critical').length;
    const highFlags = tr.filter((t: any) => t.flag_severity === 'high').length;
    const strEscalated = tr.filter((t: any) => String(t.status).toLowerCase().includes('str') || String(t.status).toLowerCase().includes('escalat') || String(t.status).toLowerCase() === 'reported').length;

    const totalKyc = (kyc || []).length;
    const kycComplete = (kyc || []).filter((k: any) => k.kyc_status === 'complete').length;
    const kycRate = totalKyc > 0 ? Math.round((kycComplete / totalKyc) * 100) : 0;

    const customersScreened = (screening || []).length;
    const sanctionsHits = (screening || []).filter((s: any) => s.matches_found > 0).length;

    const totalTasks = (tasks || []).length;
    const tasksCompleted = (tasks || []).filter((t: any) => t.status === 'completed').length;

    const institutionName = profile?.company_name || 'Your Institution';
    const license = profile?.cbn_license_category || 'Not specified';
    const rc = profile?.rc_number || 'N/A';
    const complianceOfficer = profile?.compliance_lead_name || profile?.full_name || 'Compliance Officer';

    const monthLabel = new Date(`${month}-01T00:00:00Z`).toLocaleString('en-NG', { month: 'long', year: 'numeric', timeZone: 'UTC' });

    const line = '='.repeat(72);
    const sub = '-'.repeat(72);

    const filedByReg: Record<string, number> = {};
    for (const r of reports) {
      const reg = (r.regulator || r.report_type || 'OTHER').toUpperCase();
      filedByReg[reg] = (filedByReg[reg] || 0) + 1;
    }

    const content = [
      line,
      `COMPLIANCE COMMITTEE REPORT — BOARD PACK`,
      `${monthLabel.toUpperCase()}`,
      line,
      ``,
      `Institution: ${institutionName}`,
      `CBN License Category: ${license}`,
      `RC Number: ${rc}`,
      `Compliance Officer: ${complianceOfficer}`,
      `Report Generated: ${new Date().toLocaleString('en-NG')}`,
      ``,
      sub,
      `EXECUTIVE SUMMARY`,
      sub,
      `During ${monthLabel}, the institution filed ${reportsReady} regulatory return(s),`,
      `raised ${criticalFlags + highFlags} AML alert(s) (${criticalFlags} critical, ${highFlags} high),`,
      `escalated ${strEscalated} to STR, screened ${customersScreened} customer(s) against sanctions lists,`,
      `and completed ${tasksCompleted} of ${totalTasks} scheduled compliance tasks.`,
      `Overall KYC completion rate stands at ${kycRate}%.`,
      ``,
      sub,
      `SECTION 1 — REGULATORY RETURNS FILED`,
      sub,
      `${pad('Returns Successfully Filed', 50)} ${reportsReady}`,
      `${pad('Returns Failed', 50)} ${reportsFailed}`,
      `${pad('Total Returns This Month', 50)} ${reports.length}`,
      ``,
      `By Regulator:`,
      ...Object.entries(filedByReg).map(([k, v]) => `  ${pad(k, 48)} ${v}`),
      ``,
      sub,
      `SECTION 2 — AML/CFT ACTIVITY`,
      sub,
      `${pad('Critical Severity Flags', 50)} ${criticalFlags}`,
      `${pad('High Severity Flags', 50)} ${highFlags}`,
      `${pad('Escalated to Suspicious Transaction Report', 50)} ${strEscalated}`,
      `${pad('Total Reviews Performed', 50)} ${tr.length}`,
      ``,
      sub,
      `SECTION 3 — CUSTOMER DUE DILIGENCE`,
      sub,
      `${pad('Total Customers on File', 50)} ${(customers || []).length}`,
      `${pad('KYC Complete', 50)} ${kycComplete}`,
      `${pad('KYC Completion Rate', 50)} ${kycRate}%`,
      ``,
      sub,
      `SECTION 4 — SANCTIONS SCREENING`,
      sub,
      `${pad('Customers Screened This Month', 50)} ${customersScreened}`,
      `${pad('Potential Matches Identified', 50)} ${sanctionsHits}`,
      `Lists Used: UN Consolidated, OFAC SDN, EU, UK HMT, CBN`,
      ``,
      sub,
      `SECTION 5 — TASK STATUS`,
      sub,
      `${pad('Tasks Completed', 50)} ${tasksCompleted} of ${totalTasks}`,
      `${pad('Completion Rate', 50)} ${totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0}%`,
      ``,
      sub,
      `SECTION 6 — CERTIFICATION`,
      sub,
      `I, ${complianceOfficer}, hereby certify that the information contained in this`,
      `Compliance Committee Report is true and accurate to the best of my knowledge,`,
      `compiled from records held by ${institutionName} for the period of ${monthLabel}.`,
      ``,
      `Compliance Officer Signature: _______________________________`,
      ``,
      `Date: _______________________________`,
      ``,
      `Board Chairman Acknowledgement: _______________________________`,
      ``,
      line,
      `Generated by RegCo Technologies Limited`,
      line,
    ].join('\n');

    const metrics = {
      reportsReady, reportsFailed, criticalFlags, highFlags, strEscalated,
      kycComplete, kycRate, tasksCompleted, totalTasks, customersScreened,
    };

    // Upload to storage
    const storagePath = `${userId}/board_pack_${month}_${Date.now()}.txt`;
    const { error: uploadErr } = await admin.storage.from('reports').upload(
      storagePath,
      new Blob([content], { type: 'text/plain;charset=utf-8' }),
      { contentType: 'text/plain;charset=utf-8', upsert: true },
    );
    if (uploadErr) console.error('upload error', uploadErr);

    const { data: signed } = await admin.storage.from('reports').createSignedUrl(storagePath, 60 * 60);

    await admin.from('compliance_reports').update({
      status: 'ready',
      content,
      metrics,
      storage_path: storagePath,
      generated_at: new Date().toISOString(),
    }).eq('id', reportId);

    return new Response(
      JSON.stringify({
        success: true,
        report_id: reportId,
        content,
        download_url: signed?.signedUrl || null,
        storage_path: storagePath,
        metrics,
      }),
      { headers: { ...corsHeaders(req), 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
