'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Palette, MessageSquare, ImageIcon, BarChart2, AlertCircle, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComponentTree from '@/components/ComponentTree';
import DesignTokenPanel from '@/components/DesignTokenPanel';
import ExplainPanel from '@/components/ExplainPanel';
import ExportPanel from '@/components/ExportPanel';
import ZoomRegion from '@/components/ZoomRegion';
import { useAnalysisStore } from '@/store/analysisStore';

// ── Loading steps ──
const LOADING_STEPS = [
  'Sending screenshot to AI…',
  'Detecting UI patterns and sections…',
  'Building component hierarchy…',
  'Extracting design tokens…',
];

function LoadingOverlay() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div
        className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
      />
      <div className="flex flex-col gap-3 w-72">
        {LOADING_STEPS.map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: i <= step ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 text-sm"
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: i < step ? 'var(--success)' : i === step ? 'var(--accent)' : 'var(--text-muted)' }}
            />
            <span style={{ color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Tab types ──
type TabKey = 'tree' | 'tokens' | 'explain';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'tree', label: 'Tree', icon: <Layers size={14} /> },
  { key: 'tokens', label: 'Tokens', icon: <Palette size={14} /> },
  { key: 'explain', label: 'Explain', icon: <MessageSquare size={14} /> },
];

export default function AnalyzePage() {
  const router = useRouter();
  const { imageUrl, imageFile, isAnalyzing, result, error, setAnalyzing, setResult, setError } = useAnalysisStore();
  const [activeTab, setActiveTab] = useState<TabKey>('tree');
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 });
  const analysisStarted = useRef(false);

  // Redirect to home if no image
  useEffect(() => {
    if (!imageUrl || !imageFile) {
      router.replace('/');
    }
  }, [imageUrl, imageFile, router]);

  // Run analysis once
  useEffect(() => {
    if (!imageFile || analysisStarted.current || result) return;
    analysisStarted.current = true;

    const run = async () => {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const res = await fetch('/api/analyze', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Analysis failed');
        setResult(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Analysis failed';
        setError(message);
      }
    };

    run();
  }, [imageFile, result, setAnalyzing, setResult, setError]);

  if (!imageUrl) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      <Navbar />

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {isAnalyzing && !result ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingOverlay />
            </motion.div>
          ) : error && !result ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(248, 113, 113, 0.12)', border: '1px solid rgba(248, 113, 113, 0.25)' }}
              >
                <AlertCircle size={24} style={{ color: 'var(--danger)' }} />
              </div>
              <div className="text-center max-w-md">
                <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Analysis failed
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
              </div>
              <button
                id="retry-analysis-btn"
                onClick={() => {
                  analysisStarted.current = false;
                  setError(null);
                  setAnalyzing(false);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                <RefreshCw size={14} />
                Retry Analysis
              </button>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col lg:flex-row flex-1 gap-0 lg:gap-0"
            >
              {/* ── LEFT PANEL (40%) ── */}
              <div
                className="w-full lg:w-[40%] flex flex-col gap-4 p-5 lg:p-6 lg:border-r overflow-y-auto"
                style={{ borderColor: 'var(--border-subtle)', maxHeight: 'calc(100vh - 65px)' }}
              >
                {/* Screenshot with zoom */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon size={14} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      Screenshot
                    </span>
                  </div>
                  <ZoomRegion
                    imageUrl={imageUrl}
                    naturalWidth={imgDimensions.w}
                    naturalHeight={imgDimensions.h}
                  />
                  {/* Hidden image to read natural dimensions */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt=""
                    className="hidden"
                    onLoad={e => {
                      const img = e.currentTarget;
                      setImgDimensions({ w: img.naturalWidth, h: img.naturalHeight });
                    }}
                  />
                </div>

                {/* Stats bar */}
                <div
                  className="grid grid-cols-3 gap-2 rounded-xl p-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <BarChart2 size={16} style={{ color: 'var(--accent)' }} />
                    <span className="text-xl font-bold font-mono" style={{ color: 'var(--accent)' }}>
                      {result.componentCount}
                    </span>
                    <span className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>components</span>
                  </div>
                  <div className="flex flex-col items-center gap-1" style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                    <span className="text-base">🔁</span>
                    <span className="text-xl font-bold font-mono" style={{ color: 'var(--success)' }}>
                      {result.repeatedPatterns.length}
                    </span>
                    <span className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>patterns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Palette size={16} style={{ color: 'var(--warning)' }} />
                    <span className="text-xl font-bold font-mono" style={{ color: 'var(--warning)' }}>
                      {result.tokens.colors.length}
                    </span>
                    <span className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>tokens</span>
                  </div>
                </div>
              </div>

              {/* ── RIGHT PANEL (60%) ── */}
              <div
                className="w-full lg:w-[60%] flex flex-col p-5 lg:p-6 gap-5 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 65px)' }}
              >
                {/* Tabs */}
                <div
                  className="flex items-center gap-1 p-1 rounded-xl"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                >
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      id={`result-tab-${tab.key}`}
                      onClick={() => setActiveTab(tab.key)}
                      className="flex items-center gap-1.5 flex-1 justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150"
                      style={{
                        background: activeTab === tab.key ? 'var(--accent)' : 'transparent',
                        color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1"
                  >
                    {activeTab === 'tree' && (
                      <div
                        className="rounded-xl p-4 h-full"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', minHeight: '300px' }}
                      >
                        <ComponentTree root={result.tree} />
                      </div>
                    )}
                    {activeTab === 'tokens' && <DesignTokenPanel tokens={result.tokens} />}
                    {activeTab === 'explain' && (
                      <ExplainPanel
                        explanation={result.explanation}
                        repeatedPatterns={result.repeatedPatterns}
                        componentCount={result.componentCount}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Export panel — always visible */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      Export Code
                    </span>
                  </div>
                  <ExportPanel tree={result.tree} />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
