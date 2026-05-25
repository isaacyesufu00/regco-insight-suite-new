import { useProfile } from '@/contexts/ProfileContext';
import { getFeatures, getTier, TIER_LABEL, type FeatureSet } from '@/config/featureTiers';

export const useFeatureAccess = () => {
  const { licenseCategory } = useProfile();
  const tierKey = getTier(licenseCategory);
  const features = getFeatures(licenseCategory);
  return {
    ...features,
    tier: tierKey,
    tierLabel: TIER_LABEL[tierKey] || 'Microfinance Bank',
    licenseCategory,
    canAccess: (feature: keyof FeatureSet) => {
      const v = features[feature];
      if (typeof v === 'boolean') return v;
      if (typeof v === 'number') return v > 0;
      if (Array.isArray(v)) return v.length > 0;
      return false;
    },
  };
};
