import { useEffect, useRef, useState } from 'react';

const TIERS = [
  { id: 'unit', label: 'Unit MFB', summary: '₦350k/month · CBN/NFIU/FIRS · 1 user' },
  { id: 'state', label: 'State MFB', summary: '₦700k/month · All 17 returns · 3 users' },
  { id: 'national', label: 'National MFB', summary: '₦1.5M/month · API access · 10 users' },
  { id: 'commercial', label: 'Commercial Bank', summary: '₦3M/month · Unlimited · White-label' },
];

const FALLBACK_TOKEN = 'pk.eyJ1IjoiaXNhYWNucmoiLCJhIjoiY21wd2hrNGh6MDBobDJyc2JrOGQ0N240MiJ9.nTJtDkPUmziOf1_ZsKBp1g';

export function CompactWhoWeServe() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('state');

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN || FALLBACK_TOKEN;
    if (!token || !mapContainer.current) return;
    let map: any;
    let cancelled = false;
    (async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      if (cancelled || !mapContainer.current) return;
      mapboxgl.accessToken = token;
      map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [7.4879, 9.0565],
        zoom: 2.5,
        projection: { name: 'globe' } as any,
        attributionControl: false,
        interactive: false,
      });
      map.on('load', () => {
        map.setFog({
          color: 'rgb(12, 24, 42)',
          'high-color': 'rgb(20, 36, 58)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(5, 10, 20)',
          'star-intensity': 0.15,
        });
        setTimeout(() => {
          map.flyTo({ center: [7.4879, 9.0565], zoom: 5.5, duration: 3500, essential: true });
        }, 800);
        const el = document.createElement('div');
        el.style.cssText = 'width:12px;height:12px;border-radius:50%;background:#0b8c6e;border:2px solid #fff;box-shadow:0 0 12px rgba(11,140,110,0.8)';
        new mapboxgl.Marker({ element: el }).setLngLat([7.4879, 9.0565]).addTo(map);
      });
    })();
    return () => { cancelled = true; if (map) map.remove(); };
  }, []);

  const tier = TIERS.find(t => t.id === active)!;

  return (
    <section className="section-white" style={{ padding: '100px 24px 40px', borderTop: '1px solid var(--bd-light)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto 60px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--tx-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Who we serve
        </p>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05, color: 'var(--tx-primary)', margin: 0 }}>
          Every licensed institution.<br />One platform.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--tx-secondary)', maxWidth: 560, margin: '20px auto 0' }}>
          Unit MFBs through to Commercial Banks. Abuja to Lagos.
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', height: 580, borderRadius: 'var(--r-card)', overflow: 'hidden', background: '#05101e' }}>
        <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,16,30,0.95) 0%, rgba(5,16,30,0.7) 30%, rgba(5,16,30,0) 60%)', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', top: 40, left: 40, bottom: 40, width: 360, color: '#fff', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800, letterSpacing: '-1.2px', color: '#fff', margin: 0 }}>RegCo for</h3>

          <div style={{ marginTop: 32, flex: 1 }}>
            {TIERS.map(t => {
              const isActive = t.id === active;
              return (
                <div key={t.id} onClick={() => setActive(t.id)}
                  style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? '#0b8c6e' : 'rgba(255,255,255,0.2)', boxShadow: isActive ? '0 0 10px rgba(11,140,110,0.8)' : 'none' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}>{t.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '0 0 8px' }}>{tier.summary}</p>
            <a href="/solutions" style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0daf89', textDecoration: 'none' }}>See full details →</a>
          </div>

          <p style={{ marginTop: 20, fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>📍 Abuja, Nigeria · CBN Headquarters</p>
        </div>
      </div>
    </section>
  );
}

export default CompactWhoWeServe;
