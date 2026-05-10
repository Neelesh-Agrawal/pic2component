'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Crosshair, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisStore } from '@/store/analysisStore';

interface ZoomRegionProps {
  imageUrl: string;
  naturalWidth: number;
  naturalHeight: number;
}

interface Rect { x: number; y: number; w: number; h: number }

export default function ZoomRegion({ imageUrl, naturalWidth, naturalHeight }: ZoomRegionProps) {
  const { setAnalyzing, setResult, setError } = useAnalysisStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [startPt, setStartPt] = useState<{ x: number; y: number } | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [hasSubResult, setHasSubResult] = useState(false);

  const toggleMode = () => {
    setIsSelecting(s => !s);
    setRect(null);
  };

  const getRelPt = (e: React.MouseEvent): { x: number; y: number } => {
    const bounds = containerRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (e.clientY - bounds.top) / bounds.height)),
    };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!isSelecting) return;
    e.preventDefault();
    setSelecting(true);
    setStartPt(getRelPt(e));
    setRect(null);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!selecting || !startPt) return;
    const pt = getRelPt(e);
    setRect({
      x: Math.min(startPt.x, pt.x),
      y: Math.min(startPt.y, pt.y),
      w: Math.abs(pt.x - startPt.x),
      h: Math.abs(pt.y - startPt.y),
    });
  };

  const onMouseUp = () => setSelecting(false);

  const analyzeRegion = useCallback(async () => {
    if (!rect || rect.w < 0.02 || rect.h < 0.02) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = async () => {
      const sx = rect.x * img.naturalWidth;
      const sy = rect.y * img.naturalHeight;
      const sw = rect.w * img.naturalWidth;
      const sh = rect.h * img.naturalHeight;
      canvas.width = sw;
      canvas.height = sh;
      canvas.getContext('2d')?.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'region.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append('image', file);
        setAnalyzing(true);
        try {
          const res = await fetch('/api/analyze', { method: 'POST', body: formData });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setResult(data);
          setHasSubResult(true);
          setIsSelecting(false);
          setRect(null);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Region analysis failed');
        }
      }, 'image/png');
    };
  }, [rect, imageUrl, setAnalyzing, setResult, setError]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Controls bar */}
      <div className="flex items-center gap-2 mb-2">
        <button
          id="zoom-region-toggle"
          onClick={toggleMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{
            background: isSelecting ? 'var(--accent)' : 'var(--bg-surface-2)',
            color: isSelecting ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${isSelecting ? 'var(--accent)' : 'var(--border-subtle)'}`,
          }}
        >
          <Crosshair size={12} />
          {isSelecting ? 'Cancel selection' : 'Analyze region'}
        </button>
        {hasSubResult && (
          <button
            id="zoom-reset-btn"
            onClick={() => setHasSubResult(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }}
          >
            <RotateCcw size={12} />
            Back to full analysis
          </button>
        )}
      </div>

      {/* Image + overlay */}
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          cursor: isSelecting ? 'crosshair' : 'default',
          border: `1px solid ${isSelecting ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
          userSelect: 'none',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Screenshot preview"
          className="w-full h-auto block"
          draggable={false}
        />

        {/* Selection rectangle */}
        <AnimatePresence>
          {rect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none"
              style={{
                left: `${rect.x * 100}%`,
                top: `${rect.y * 100}%`,
                width: `${rect.w * 100}%`,
                height: `${rect.h * 100}%`,
                border: '2px solid var(--accent)',
                background: 'rgba(124, 111, 247, 0.1)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Analyze button */}
      <AnimatePresence>
        {rect && rect.w > 0.02 && rect.h > 0.02 && !selecting && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-2 flex items-center gap-2"
          >
            <button
              id="analyze-region-btn"
              onClick={analyzeRegion}
              className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Analyze this region
            </button>
            <button
              onClick={() => setRect(null)}
              className="p-2 rounded-xl"
              style={{ background: 'var(--bg-surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isSelecting && !rect && (
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
          Click and drag on the image to select a region
        </p>
      )}
    </div>
  );
}
