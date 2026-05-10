'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cpu, Layers, Palette, Zap, ArrowRight, GitBranch } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadDropzone from '@/components/UploadDropzone';

// ── Animated counter ──
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return <>{count}</>;
}

const FEATURES = [
  {
    icon: <Layers size={22} />,
    title: 'Component Intelligence',
    description: 'Detects FeatureCard × 6, not Box1 through Box6. Semantic names that match your mental model.',
  },
  {
    icon: <Palette size={22} />,
    title: 'Design Token Extraction',
    description: 'Colors, spacing, typography, radii, and shadows pulled automatically from every screenshot.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Instant Code Export',
    description: 'React JSX, Tailwind, HTML, JSON — one click. Ready to paste into your project.',
  },
];

const STEPS = [
  { num: '01', text: 'Upload any UI screenshot — web, mobile, desktop, any platform' },
  { num: '02', text: 'AI detects every reusable component, pattern, and design token' },
  { num: '03', text: 'Export structured code ready to paste directly into your project' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center px-6 pt-24 pb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
          >
            <Cpu size={12} />
            Powered by Groq llama-4-scout · Free to use
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--text-primary)' }}
          >
            Turn any UI screenshot into a{' '}
            <span style={{ color: 'var(--accent)' }}>component tree</span>{' '}
            — instantly.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="max-w-xl text-lg leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            AI-powered structure detection for developers and designers.
            No guessing, no manual tracing.
          </motion.p>

          {/* Upload dropzone */}
          <div className="w-full max-w-2xl">
            <UploadDropzone />
          </div>

          {/* Animated stat bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-2"
          >
            {[
              { value: 14, label: 'components detected', color: 'var(--accent)' },
              { value: 3, label: 'repeated patterns', color: 'var(--success)' },
              { value: 8, label: 'design tokens extracted', color: 'var(--warning)' },
            ].map(({ value, label, color }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className="font-bold text-lg font-mono" style={{ color }}>
                  <AnimatedCounter target={value} />
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Feature strip ── */}
        <section className="px-6 py-16 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i + 0.3 }}
                className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 group cursor-default"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-border)';
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface-2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    className="font-semibold text-base mb-1.5"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-syne)' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="px-6 py-16 max-w-3xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <GitBranch size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              How it works
            </span>
          </motion.div>

          <div className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                className="flex items-start gap-5"
              >
                <span
                  className="text-2xl font-bold font-mono shrink-0 w-10 text-right"
                  style={{ fontFamily: 'var(--font-syne)', color: 'var(--accent)', opacity: 0.5 }}
                >
                  {step.num}
                </span>
                <div
                  className="flex-1 rounded-xl px-5 py-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-2 mt-12 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
            Drop a screenshot above to get started — no account needed
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
