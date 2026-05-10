'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Repeat2, Hash, Sparkles } from 'lucide-react';

interface ExplainPanelProps {
  explanation: string;
  repeatedPatterns: string[];
  componentCount: number;
}

export default function ExplainPanel({ explanation, repeatedPatterns, componentCount }: ExplainPanelProps) {
  return (
    <div className="flex flex-col gap-5 pb-4">

      {/* Structure rationale */}
      <section
        className="rounded-xl p-4"
        style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          <h4 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Structure Rationale
          </h4>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {explanation}
        </p>
      </section>

      {/* Repeated patterns */}
      {repeatedPatterns.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Repeat2 size={14} style={{ color: 'var(--accent)' }} />
            <h4 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Repeated Patterns Detected
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            {repeatedPatterns.map((pattern, i) => (
              <motion.div
                key={pattern}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-lg"
                style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }}
              >
                <span style={{ color: 'var(--accent)' }}>✦</span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                  {pattern}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Component count */}
      <section className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-border)' }}
        >
          <Hash size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            {componentCount} unique components
          </span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>in hierarchy</span>
        </div>
      </section>

      {/* Pro tip callout */}
      <section
        className="rounded-xl p-4 flex gap-3"
        style={{
          background: 'rgba(124, 111, 247, 0.06)',
          border: '1px solid var(--accent-border)',
        }}
      >
        <Lightbulb size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--accent)' }}>Pro tip:</strong> Components repeated 3+ times are ideal candidates
          for your design system. Extract them into shared primitives to ensure consistency and reduce maintenance overhead.
        </p>
      </section>
    </div>
  );
}
