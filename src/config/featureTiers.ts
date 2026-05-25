export type FeatureSet = {
  reportGeneration: boolean;
  maxReportsPerMonth: number;
  reportTypes: string[];
  transactionMonitor: boolean;
  liveWebhook: boolean;
  customerIntelligence: boolean;
  riskAnalysis: boolean;
  sanctionsScreening: boolean;
  boardPack: boolean;
  auditTracker: boolean;
  regulatoryIntelligence: boolean;
  monthlyTasks: boolean;
  dataIngestion: boolean;
  maxCustomers: number;
  maxTransactionsPerUpload: number;
  maxUsersAllowed: number;
};

export const FEATURE_TIERS: Record<string, FeatureSet> = {
  unit_mfb: {
    reportGeneration: true, maxReportsPerMonth: 10,
    reportTypes: ['CBN', 'NFIU', 'FIRS'],
    transactionMonitor: true, liveWebhook: false,
    customerIntelligence: false, riskAnalysis: false,
    sanctionsScreening: false, boardPack: false,
    auditTracker: false, regulatoryIntelligence: true,
    monthlyTasks: true, dataIngestion: false,
    maxCustomers: 0, maxTransactionsPerUpload: 1000, maxUsersAllowed: 1,
  },
  state_mfb: {
    reportGeneration: true, maxReportsPerMonth: 50,
    reportTypes: ['CBN', 'NFIU', 'SCUML', 'NDIC', 'FIRS'],
    transactionMonitor: true, liveWebhook: true,
    customerIntelligence: true, riskAnalysis: true,
    sanctionsScreening: true, boardPack: true,
    auditTracker: true, regulatoryIntelligence: true,
    monthlyTasks: true, dataIngestion: true,
    maxCustomers: 5000, maxTransactionsPerUpload: 10000, maxUsersAllowed: 3,
  },
  national_mfb: {
    reportGeneration: true, maxReportsPerMonth: 200,
    reportTypes: ['CBN', 'NFIU', 'SCUML', 'NDIC', 'FIRS'],
    transactionMonitor: true, liveWebhook: true,
    customerIntelligence: true, riskAnalysis: true,
    sanctionsScreening: true, boardPack: true,
    auditTracker: true, regulatoryIntelligence: true,
    monthlyTasks: true, dataIngestion: true,
    maxCustomers: 100000, maxTransactionsPerUpload: 100000, maxUsersAllowed: 10,
  },
  pmb: {
    reportGeneration: true, maxReportsPerMonth: 50,
    reportTypes: ['CBN', 'NFIU', 'NDIC', 'FIRS'],
    transactionMonitor: true, liveWebhook: false,
    customerIntelligence: true, riskAnalysis: true,
    sanctionsScreening: true, boardPack: true,
    auditTracker: true, regulatoryIntelligence: true,
    monthlyTasks: true, dataIngestion: true,
    maxCustomers: 10000, maxTransactionsPerUpload: 20000, maxUsersAllowed: 3,
  },
  finance_company: {
    reportGeneration: true, maxReportsPerMonth: 30,
    reportTypes: ['NFIU', 'SCUML', 'FIRS'],
    transactionMonitor: true, liveWebhook: false,
    customerIntelligence: false, riskAnalysis: false,
    sanctionsScreening: true, boardPack: false,
    auditTracker: false, regulatoryIntelligence: true,
    monthlyTasks: true, dataIngestion: false,
    maxCustomers: 0, maxTransactionsPerUpload: 5000, maxUsersAllowed: 2,
  },
  commercial_bank: {
    reportGeneration: true, maxReportsPerMonth: 999,
    reportTypes: ['CBN', 'NFIU', 'SCUML', 'NDIC', 'FIRS'],
    transactionMonitor: true, liveWebhook: true,
    customerIntelligence: true, riskAnalysis: true,
    sanctionsScreening: true, boardPack: true,
    auditTracker: true, regulatoryIntelligence: true,
    monthlyTasks: true, dataIngestion: true,
    maxCustomers: 999999, maxTransactionsPerUpload: 999999, maxUsersAllowed: 999,
  },
};

export const TIER_LABEL: Record<string, string> = {
  unit_mfb: 'Unit Microfinance Bank',
  state_mfb: 'State Microfinance Bank',
  national_mfb: 'National Microfinance Bank',
  pmb: 'Primary Mortgage Bank',
  finance_company: 'Finance Company',
  commercial_bank: 'Commercial Bank',
};

export const getTier = (cat: string): keyof typeof FEATURE_TIERS => {
  const c = (cat || '').toLowerCase();
  if (c.includes('unit')) return 'unit_mfb';
  if (c.includes('state')) return 'state_mfb';
  if (c.includes('national')) return 'national_mfb';
  if (c.includes('commercial')) return 'commercial_bank';
  if (c.includes('mortgage') || c.includes('pmb')) return 'pmb';
  if (c.includes('finance') || c.includes('fintech')) return 'finance_company';
  return 'unit_mfb';
};

export const getFeatures = (cat: string): FeatureSet => FEATURE_TIERS[getTier(cat)];
