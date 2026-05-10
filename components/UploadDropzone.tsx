'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload, ImagePlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisStore } from '@/store/analysisStore';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    if (file.size <= 2 * 1024 * 1024) return resolve(file);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, Math.sqrt((1 * 1024 * 1024) / file.size));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          else resolve(file);
        },
        'image/jpeg',
        0.85
      );
    };
    img.src = url;
  });
}

export default function UploadDropzone() {
  const router = useRouter();
  const { setImage } = useAnalysisStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const pasteHandlerRef = useRef<((e: ClipboardEvent) => void) | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error('Only PNG, JPG, WEBP are supported');
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error('Image must be under 10MB');
        return;
      }
      setIsNavigating(true);
      const compressed = await compressImage(file);
      const url = URL.createObjectURL(compressed);
      setImage(compressed, url);
      router.push('/analyze');
    },
    [setImage, router]
  );

  // Clipboard paste support
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith('image/'));
      if (imageItem) {
        const file = imageItem.getAsFile();
        if (file) handleFile(file);
      }
    };
    pasteHandlerRef.current = handler;
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [handleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => { if (accepted[0]) handleFile(accepted[0]); },
    accept: { 'image/png': [], 'image/jpeg': [], 'image/webp': [] },
    maxSize: MAX_SIZE,
    multiple: false,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === 'file-too-large') toast.error('Image must be under 10MB');
      else toast.error('Only PNG, JPG, WEBP are supported');
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        {...getRootProps()}
        id="upload-dropzone"
        className="relative cursor-pointer rounded-2xl p-10 text-center transition-all duration-300 select-none"
        style={{
          background: isDragActive ? 'var(--accent-muted)' : 'var(--bg-surface)',
          border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border-subtle)'}`,
          boxShadow: isDragActive ? '0 0 32px rgba(124, 111, 247, 0.25)' : 'none',
        }}
      >
        <input {...getInputProps()} id="upload-input" />

        <AnimatePresence mode="wait">
          {isNavigating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Preparing analysis…</p>
            </motion.div>
          ) : isDragActive ? (
            <motion.div
              key="drag"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <ImagePlus size={40} style={{ color: 'var(--accent)' }} />
              <p className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>Drop it!</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-border)' }}
              >
                <Upload size={28} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Drop a screenshot here
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  or click to browse · paste with{' '}
                  <kbd
                    className="px-1.5 py-0.5 rounded text-xs font-mono"
                    style={{ background: 'var(--bg-surface-3)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                  >
                    Ctrl+V
                  </kbd>
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {['PNG', 'JPG', 'WEBP'].map((ext) => (
                  <span
                    key={ext}
                    className="px-2 py-1 rounded-md text-xs font-mono"
                    style={{ background: 'var(--bg-surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
                  >
                    {ext}
                  </span>
                ))}
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· max 10MB</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                📱 Mobile? Tap to take a photo or pick from gallery
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag overlay glow corners */}
        {isDragActive && (
          <>
            <X size={0} className="hidden" />
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: 'inset 0 0 0 2px var(--accent)' }} />
          </>
        )}
      </div>
    </motion.div>
  );
}
