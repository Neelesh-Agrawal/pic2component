'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';
import { DesignTokens } from '@/types';

interface DesignTokenPanelProps {
  tokens: DesignTokens;
}

function CSSVariables({ tokens }: { tokens: DesignTokens }) {
  const lines: string[] = [':root {'];
  tokens.colors.forEach(c => {
    lines.push(`  --color-${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`);
  });
  tokens.spacing.forEach((s, i) => {
    lines.push(`  --spacing-${i}: ${s};`);
  });
  tokens.borderRadius.forEach((r, i) => {
    lines.push(`  --radius-${i}: ${r};`);
  });
  tokens.fontSizes.forEach((f, i) => {
    lines.push(`  --font-size-${i}: ${f};`);
  });
  lines.push('}');
  return lines.join('\n');
}

export default function DesignTokenPanel({ tokens }: DesignTokenPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyCSS = () => {
    navigator.clipboard.writeText(CSSVariables({ tokens })).then(() => {
      setCopied(true);
      toast.success('CSS variables copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-4">

      {/* Colors */}
      <section>
        <h4 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          Colors
        </h4>
        <div className="flex flex-wrap gap-3">
          {tokens.colors.map((color) => (
            <div
              key={color.hex}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
              style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }}
            >
              <div
                className="w-8 h-8 rounded-full shrink-0 ring-1 ring-white/10"
                style={{ background: color.hex }}
              />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{color.name}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{color.hex}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Font sizes */}
      {tokens.fontSizes.length > 0 && (
        <section>
          <h4 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Typography Scale
          </h4>
          <div className="flex flex-col gap-1.5">
            {tokens.fontSizes.map((size) => (
              <div key={size} className="flex items-baseline gap-3">
                <span
                  className="font-mono text-xs w-12 shrink-0 text-right"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {size}
                </span>
                <span
                  style={{
                    fontSize: size,
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  The quick brown fox
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Spacing */}
      {tokens.spacing.length > 0 && (
        <section>
          <h4 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Spacing Scale
          </h4>
          <div className="flex flex-wrap items-end gap-2">
            {tokens.spacing.map((space) => (
              <div key={space} className="flex flex-col items-center gap-1">
                <div
                  style={{
                    width: space,
                    height: space,
                    background: 'var(--accent-muted)',
                    border: '1px solid var(--accent-border)',
                    borderRadius: '4px',
                    minWidth: '4px',
                    minHeight: '4px',
                    maxWidth: '80px',
                    maxHeight: '80px',
                  }}
                />
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{space}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Border radius */}
      {tokens.borderRadius.length > 0 && (
        <section>
          <h4 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Border Radius
          </h4>
          <div className="flex flex-wrap gap-3">
            {tokens.borderRadius.map((radius) => (
              <div key={radius} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10"
                  style={{
                    borderRadius: radius,
                    background: 'var(--bg-surface-2)',
                    border: '2px solid var(--accent)',
                  }}
                />
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{radius}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shadows */}
      {tokens.shadows.length > 0 && (
        <section>
          <h4 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Shadows
          </h4>
          <div className="flex flex-wrap gap-4">
            {tokens.shadows.map((shadow) => (
              <div
                key={shadow}
                className="w-16 h-16 rounded-xl"
                style={{
                  background: 'var(--bg-surface-2)',
                  boxShadow: shadow,
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Copy CSS button */}
      <button
        id="copy-css-vars-btn"
        onClick={copyCSS}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-2"
        style={{
          background: copied ? 'rgba(52, 211, 153, 0.12)' : 'var(--accent-muted)',
          color: copied ? 'var(--success)' : 'var(--accent)',
          border: `1px solid ${copied ? 'rgba(52, 211, 153, 0.25)' : 'var(--accent-border)'}`,
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied!' : 'Copy as CSS variables'}
      </button>
    </div>
  );
}
