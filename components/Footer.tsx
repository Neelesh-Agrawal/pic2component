'use client';


import { Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-5 mt-8"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2">
        <Cpu size={14} style={{ color: 'var(--accent)' }} />
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--text-primary)' }}
        >
          Pic2<span style={{ color: 'var(--accent)' }}>Component</span>
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          · Built with Groq llama-4-scout
        </span>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://console.groq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs transition-colors duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
        >
          Get Groq API key →
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs transition-colors duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
        >
          <ExternalLink size={12} />
          GitHub
        </a>
      </div>
    </footer>
  );
}
