'use client';

import { create } from 'zustand';
import { AnalysisResult } from '@/types';

interface AnalysisStore {
  // State
  imageFile: File | null;
  imageUrl: string | null;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  activeExport: 'jsx' | 'html' | 'tailwind' | 'json';

  // Actions
  setImage: (file: File, url: string) => void;
  setAnalyzing: (v: boolean) => void;
  setResult: (r: AnalysisResult) => void;
  setError: (e: string | null) => void;
  setActiveExport: (tab: 'jsx' | 'html' | 'tailwind' | 'json') => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  imageFile: null,
  imageUrl: null,
  isAnalyzing: false,
  result: null,
  error: null,
  activeExport: 'jsx',

  setImage: (file, url) => set({ imageFile: file, imageUrl: url, result: null, error: null }),
  setAnalyzing: (v) => set({ isAnalyzing: v }),
  setResult: (r) => set({ result: r, isAnalyzing: false }),
  setError: (e) => set({ error: e, isAnalyzing: false }),
  setActiveExport: (tab) => set({ activeExport: tab }),
  reset: () => set({ imageFile: null, imageUrl: null, result: null, error: null }),
}));
