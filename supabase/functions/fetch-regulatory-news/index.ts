import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Source {
  url: string;
  name: string;
  category: string;
  keywords: string[];
}

const sources: Source[] = [
  { url: 'https://nairametrics.com/feed/', name: 'Nairametrics', category: 'regulation', keywords: ['CBN', 'NDIC', 'NFIU', 'bank', 'regulation', 'compliance', 'microfinance'] },
  { url: 'https://businessday.ng/feed/', name: 'BusinessDay', category: 'banking', keywords: ['CBN', 'bank', 'finance', 'regulation'] },
  { url: 'https://punchng.com/feed/', name: 'Punch Nigeria', category: 'economy', keywords: ['CBN', 'bank', 'NDIC', 'finance'] },
  { url: 'https://www.vanguardngr.com/category/business/feed/', name: 'Vanguard', category: 'banking', keywords: ['CBN', 'bank', 'regulation'] },
  { url: 'https://guardian.ng/category/business/feed/', name: 'The Guardian Nigeria', category: 'economy', keywords: ['CBN', 'finance', 'bank'] },
  { url: 'https://www.thisdaylive.com/index.php/category/business/feed/', name: 'ThisDay', category: 'regulation', keywords: ['CBN', 'NDIC', 'compliance'] },
];

const fetchWithTimeout = async (url: string, timeout = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RegCo-NewsBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
};

const stripCData = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
const stripHTML = (s: string) => s.replace(/<[^>]*>/g, '').trim();

const parseRSS = (xml: string, source: Source) => {
  const articles: any[] = [];
  const items = xml.match(/<item[\s\S]*?<\/item>/g) || [];

  for (const item of items.slice(0, 15)) {
    const getTag = (tag: string) => {
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
      const m = item.match(re);
      return m ? stripHTML(stripCData(m[1])) : '';
    };

    const title = getTag('title');
    const link = getTag('link');
    const description = getTag('description');
    const pubDate = getTag('pubDate');

    if (!title || !link || title.length < 6) continue;

    const haystack = `${title} ${description}`.toLowerCase();
    const matches = source.keywords.some((k) => haystack.includes(k.toLowerCase()));
    if (!matches) continue;

    articles.push({
      title: title.slice(0, 240),
      description: description.slice(0, 480),
      url: link,
      published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      source: source.name,
      category: source.category,
    });
  }
  return articles;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  const allArticles: any[] = [];
  const errors: string[] = [];
  const sourceStats: Record<string, number> = {};

  for (const s of sources) {
    try {
      const res = await fetchWithTimeout(s.url, 8000);
      if (res.ok) {
        const text = await res.text();
        const items = parseRSS(text, s);
        allArticles.push(...items);
        sourceStats[s.name] = items.length;
      } else {
        errors.push(`${s.name}: HTTP ${res.status}`);
      }
    } catch (e) {
      errors.push(`${s.name}: ${(e as Error).message}`);
    }
  }

  // Optional NewsAPI augmentation
  const newsApiKey = Deno.env.get('NEWSAPI_KEY');
  if (newsApiKey) {
    const queries = ['CBN Nigeria regulation', 'NDIC Nigeria bank', 'NFIU Nigeria AML'];
    for (const q of queries) {
      try {
        const r = await fetchWithTimeout(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=8&apiKey=${newsApiKey}`,
          8000,
        );
        if (r.ok) {
          const data = await r.json();
          for (const a of (data.articles || []).filter((x: any) => x.title && !String(x.title).includes('[Removed]'))) {
            allArticles.push({
              title: String(a.title).slice(0, 240),
              description: String(a.description || '').slice(0, 480),
              url: a.url,
              published_at: a.publishedAt || new Date().toISOString(),
              source: a.source?.name || 'NewsAPI',
              category: 'nigeria-banking',
              image_url: a.urlToImage,
            });
          }
        }
      } catch (e) {
        errors.push(`NewsAPI(${q}): ${(e as Error).message}`);
      }
    }
  }

  let stored = 0;
  for (const article of allArticles) {
    if (!article.title || !article.url) continue;
    const { error } = await supabase
      .from('regulatory_news')
      .upsert(
        {
          title: article.title,
          description: article.description || '',
          url: article.url,
          published_at: article.published_at,
          source: article.source,
          category: article.category,
          image_url: article.image_url || null,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: 'url', ignoreDuplicates: false },
      );
    if (!error) stored++;
  }

  return new Response(
    JSON.stringify({
      success: true,
      articles_fetched: allArticles.length,
      articles_stored: stored,
      source_stats: sourceStats,
      errors,
      fetched_at: new Date().toISOString(),
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
