import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import type { FeatureSet } from '@/config/featureTiers';

interface FeatureGateProps {
  feature: keyof FeatureSet;
  children: ReactNode;
  requiredTier?: string;
}

export default function FeatureGate({ feature, children, requiredTier }: FeatureGateProps) {
  const { canAccess, tierLabel } = useFeatureAccess();
  if (canAccess(feature)) return <>{children}</>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: 40 }}>
      <div style={{
        background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)',
        padding: '48px 56px', maxWidth: 460, textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: '#F5F5F0',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <Lock size={24} color="#0A0A0A" strokeWidth={1.8} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0A0A0A', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
          Feature not available on your plan
        </h2>
        <p style={{ fontSize: 13.5, color: '#6B6B6B', margin: '0 0 8px', lineHeight: 1.55 }}>
          Your current plan is <strong style={{ color: '#0A0A0A' }}>{tierLabel}</strong>.
        </p>
        <p style={{ fontSize: 13.5, color: '#6B6B6B', margin: '0 0 24px', lineHeight: 1.55 }}>
          {requiredTier ? `This feature is included from ${requiredTier} and above.` : 'Upgrade your plan to unlock this feature.'}
        </p>
        <Link
          to="/book-demo"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#0A0A0A', color: '#FFFFFF', padding: '11px 22px', borderRadius: 999,
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          Request an upgrade →
        </Link>
      </div>
    </div>
  );
}
