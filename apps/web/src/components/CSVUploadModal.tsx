import React, { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, UploadCloud, ShieldCheck, FileSpreadsheet, AlertCircle, HelpCircle } from 'lucide-react';
import { uploadConnectionsCSV } from '../services/api';
import { UploadResponse } from '../types';
import * as Sentry from '@sentry/react';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (res: UploadResponse) => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a valid .csv file exported from LinkedIn.');
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      const res = await uploadConnectionsCSV(file);
      onUploadSuccess(res);
      onClose();
    } catch (err: any) {
      if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.captureException(err);
      }
      setError(err.message || 'Failed to parse CSV. Please ensure it is a valid LinkedIn export.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:p-6 z-50 text-white outline-none animate-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="font-display font-semibold text-base sm:text-lg text-white truncate">
                  Upload LinkedIn Connections
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-400 truncate">
                  Analyze your personal network in an ephemeral, private session
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Privacy Guarantee Notice */}
          <div className="mt-4 p-3 sm:p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 sm:gap-3 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <span className="font-semibold block text-emerald-200">Strict GDPR Zero-Persistence Guarantee</span>
              Your file is processed purely in volatile RAM. No PII (names, companies, contacts) is ever stored to disk or database. Auto-purged after 30 minutes or immediately upon clicking 'Purge My Data'.
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-4 border-2 border-dashed rounded-2xl p-5 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                : 'border-slate-700 hover:border-indigo-500/50 bg-slate-950/40 hover:bg-slate-950/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {isUploading ? 'Encoding vectors in RAM...' : 'Drop your Connections.csv here or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Standard LinkedIn data export archive (.csv) up to 15MB
              </p>
            </div>

            {isUploading && (
              <div className="w-48 bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
                <div className="bg-indigo-500 h-full animate-pulse w-full" />
              </div>
            )}
          </div>

          {/* LinkedIn Export Guide Accordion */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How do I export my Connections.csv from LinkedIn?</span>
            </button>

            {showGuide && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <p>1. Go to LinkedIn → <strong>Settings & Privacy</strong>.</p>
                <p>2. Select <strong>Data Privacy</strong> in the left sidebar.</p>
                <p>3. Click <strong>Get a copy of your data</strong>.</p>
                <p>4. Check <strong>Connections</strong> and click <strong>Request archive</strong>.</p>
                <p>5. Download the zip archive from LinkedIn's email and extract <code className="text-indigo-300">Connections.csv</code>.</p>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
