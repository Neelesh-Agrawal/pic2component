'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, RotateCcw } from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';

export default function Navbar() {
  const router = useRouter();
  const { result, reset } = useAnalysisStore();

  const handleNewAnalysis = () => {
    reset();
    router.push('/');
  };

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
      style={{
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-border)' }}
        >
          <Cpu size={16} style={{ color: 'var(--accent)' }} />
        </div>
        <span
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--text-primary)' }}
        >
          Pic2<span style={{ color: 'var(--accent)' }}>Component</span>
        </span>
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {result && (
          <button
            id="new-analysis-btn"
            onClick={handleNewAnalysis}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: 'var(--accent-muted)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-muted)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
            }}
          >
            <RotateCcw size={14} />
            New Analysis
          </button>
        )}

        <a
          href="https://console.groq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
        >
          Powered by Groq
        </a>
      </div>
    </nav>
  );
}
