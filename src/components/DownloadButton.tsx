import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { downloadReport, ReportData } from '@/utils/downloadReport';
import { toast } from 'sonner';

interface DownloadButtonProps {
  report: ReportData;
  variant?: 'primary' | 'icon' | 'text';
  size?: 'sm' | 'md';
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ report, variant = 'primary', size = 'md' }) => {
  const [downloading, setDownloading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;
    await downloadReport(
      report,
      () => setDownloading(true),
      () => { setDownloading(false); toast.success('Report downloaded successfully'); },
      (err) => { setDownloading(false); toast.error('Download failed. Please try again.'); console.error('Download error:', err); },
    );
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={downloading}
        title="Download report"
        style={{
          width: size === 'sm' ? 30 : 36,
          height: size === 'sm' ? 30 : 36,
          borderRadius: '50%',
          background: downloading ? 'rgba(0,102,204,0.06)' : 'rgba(0,102,204,0.08)',
          border: '1px solid rgba(0,102,204,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: downloading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        {downloading
          ? <Loader2 size={size === 'sm' ? 13 : 15} color="#0066CC" className="animate-spin" />
          : <Download size={size === 'sm' ? 13 : 15} color="#0066CC" />}
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={downloading}
        style={{
          background: 'none', border: 'none', color: '#0066CC',
          fontSize: 13, fontWeight: 500, cursor: downloading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0',
          opacity: downloading ? 0.6 : 1,
        }}
      >
        {downloading
          ? <><Loader2 size={12} className="animate-spin" /> Downloading...</>
          : <><Download size={12} /> Download</>}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={downloading}
      style={{
        background: downloading ? 'rgba(0,102,204,0.7)' : '#0066CC',
        color: '#FFFFFF', border: 'none', borderRadius: 980,
        padding: size === 'sm' ? '6px 14px' : '8px 20px',
        fontSize: size === 'sm' ? 12 : 13, fontWeight: 500,
        cursor: downloading ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'all 0.2s ease', whiteSpace: 'nowrap',
      }}
    >
      {downloading
        ? <><Loader2 size={13} className="animate-spin" /> Downloading...</>
        : <><Download size={13} /> Download Report</>}
    </button>
  );
};

export default DownloadButton;
