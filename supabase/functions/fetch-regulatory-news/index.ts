import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const parseRSS = (xmlText: string, source: string, category: string) => {
  const articles: any[] = [];
  const items = xmlText.match(/<item[\s\S]*?<\/item>/g) || [];

  for (const item of items.slice(0, 10)) {
    const getTag = (tag: string) => {
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
      const m = item.match(re);
      let v = (m?.[1] || '').trim();
      v = v.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
      return v;
    };

    const title = getTag('title');
    const link = getTag('link');
    const description = getTag('description');
    const pubDate = getTag('pubDate');

    if (title && link && title.length > 5) {
      articles.push({
        title: title.replace(/<[^>]*>/g, '').slice(0, 200),
        description: description.replace(/<[^>]*>/g, '').slice(0, 400),
        url: link,
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        source,
        category,
      });
    }
  }
  return articles;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  );

  const allArticles: any[] = [];
  const errors: string[] = [];

  const rssFeeds = [
    { url: 'https://nairametrics.com/category/financial-regulations/feed/', source: 'Nairametrics', category: 'regulation' },
    { url: 'https://businessday.ng/tag/cbn/feed/', source: 'BusinessDay', category: 'cbn' },
    { url: 'https://punchng.com/topics/business/banking/feed/', source: 'Punch Nigeria', category: 'banking' },
    { url: 'https://www.thisdaylive.com/index.php/category/business/feed/', source: 'ThisDay', category: 'economy' },
  ];

  for (const f of rssFeeds) {
    try {
      const res = await fetch(f.url, { headers: { 'User-Agent': 'RegCo-Compliance/1.0' } });
      if (res.ok) allArticles.push(...parseRSS(await res.text(), f.source, f.category));
    } catch (e) {
      errors.push(`${f.source}: ${(e as Error).message}`);
    }
  }

  const newsApiKey = Deno.env.get('NEWSAPI_KEY');
  if (newsApiKey) {
    const queries = [
      'CBN Nigeria regulation',
      'NDIC Nigeria bank',
      'NFIU Nigeria AML',
      'Nigerian financial institution compliance',
    ];
    for (const q of queries) {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${newsApiKey}`,
        );
        if (res.ok) {
          const data = await res.json();
          for (const a of (data.articles || []).filter((x: any) => x.title && !x.title.includes('[Removed]'))) {
            allArticles.push({
              title: a.title?.slice(0, 200),
              description: a.description?.slice(0, 400) || '',
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
        { onConflict: 'url', ignoreDuplicates: true }
      );
    if (!error) stored++;
  }

  return new Response(
    JSON.stringify({
      success: true,
      articles_fetched: allArticles.length,
      articles_stored: stored,
      errors,
      fetched_at: new Date().toISOString(),
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
