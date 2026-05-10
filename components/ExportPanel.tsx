'use client';

import { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ComponentNode } from '@/types';
import { toJSX, toHTML, toTailwind, toJSON } from '@/lib/generateCode';
import { useAnalysisStore } from '@/store/analysisStore';

interface ExportPanelProps {
  tree: ComponentNode;
}

const TABS = [
  { key: 'jsx', label: 'JSX', ext: 'jsx', lang: 'jsx' },
  { key: 'html', label: 'HTML', ext: 'html', lang: 'html' },
  { key: 'tailwind', label: 'Tailwind', ext: 'jsx', lang: 'jsx' },
  { key: 'json', label: 'JSON', ext: 'json', lang: 'json' },
] as const;

function getCode(tree: ComponentNode, tab: 'jsx' | 'html' | 'tailwind' | 'json'): string {
  switch (tab) {
    case 'jsx': return toJSX(tree);
    case 'html': return toHTML(tree);
    case 'tailwind': return toTailwind(tree);
    case 'json': return toJSON(tree);
  }
}

export default function ExportPanel({ tree }: ExportPanelProps) {
  const { activeExport, setActiveExport } = useAnalysisStore();
  const [copied, setCopied] = useState(false);

  const code = getCode(tree, activeExport);
  const lines = code.split('\n').length;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const handleDownload = useCallback(() => {
    const tab = TABS.find(t => t.key === activeExport)!;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component-tree.${tab.ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as .${tab.ext}`);
  }, [code, activeExport]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center px-4 pt-3 gap-1"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {TABS.map(tab => {
          const isActive = activeExport === tab.key;
          return (
            <button
              key={tab.key}
              id={`export-tab-${tab.key}`}
              onClick={() => setActiveExport(tab.key)}
              className="relative px-3 py-2 text-xs font-mono rounded-t-md transition-colors duration-150"
              style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="export-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2 pb-2">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {lines} lines
          </span>
          <button
            id="export-download-btn"
            onClick={handleDownload}
            className="p-1.5 rounded-md transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            title="Download file"
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
          >
            <Download size={13} />
          </button>
          <button
            id="export-copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150"
            style={{
              background: copied ? 'rgba(52, 211, 153, 0.12)' : 'var(--accent-muted)',
              color: copied ? 'var(--success)' : 'var(--accent)',
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code block */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <SyntaxHighlighter
          language={TABS.find(t => t.key === activeExport)?.lang ?? 'jsx'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '16px',
            background: 'transparent',
            fontSize: '12px',
            lineHeight: '1.6',
          }}
          showLineNumbers
          lineNumberStyle={{ color: '#55557A', fontSize: '11px', minWidth: '2.5em' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
