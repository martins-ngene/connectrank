import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Copy, Check, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { Candidate, DMTemplate } from '../types';

interface DMModalProps {
  candidate: Candidate | null;
  pitch: string;
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATES: DMTemplate[] = [
  {
    id: 'decision-maker',
    name: 'Direct Pitch (Decision Makers)',
    description: 'High-impact outreach tailored for Founders, CTOs, and VPs.',
    generateText: (c, pitch) => {
      const firstName = c.name.split(' ')[0] || 'there';
      return `Hi ${firstName},

I noticed your work leading engineering initiatives at ${c.company}.

I'm a ${pitch} with hands-on experience delivering scalable systems. I've been following what ${c.company} is building and would love to see if you have any engineering bottlenecks where an experienced contributor could make an immediate impact.

Open to a brief 10-minute sync this week to connect?

Best,
[Your Name]`;
    },
  },
  {
    id: 'peer-referral',
    name: 'Peer / Referral Inquiry',
    description: 'Casual, peer-to-peer approach for Leads and Senior Engineers.',
    generateText: (c, pitch) => {
      const firstName = c.name.split(' ')[0] || 'there';
      return `Hey ${firstName},

Saw that you're working as ${c.position} at ${c.company}—impressive stack and growth!

I specialize as a ${pitch}. I'm exploring new engineering challenges and wanted to reach out directly to someone on the ground. How do you enjoy the engineering culture at ${c.company}? 

Would love to grab a quick virtual coffee if your schedule allows.

Cheers,
[Your Name]`;
    },
  },
  {
    id: 'freelance-contract',
    name: 'Consulting / Gig Offer',
    description: 'Focused on ad-hoc contract or freelance bandwidth.',
    generateText: (c, pitch) => {
      const firstName = c.name.split(' ')[0] || 'there';
      return `Hi ${firstName},

Hope all is well at ${c.company}!

I'm currently taking on selective freelance / advisory projects as a ${pitch}. If your team at ${c.company} is tackling any upcoming roadmap sprints or infrastructure optimizations that need specialized firepower without full-time onboarding lag, I'd love to assist.

Let me know if you'd be open to reviewing a portfolio of recent deliverables.

Best regards,
[Your Name]`;
    },
  },
];

export const DMModal: React.FC<DMModalProps> = ({
  candidate,
  pitch,
  isOpen,
  onClose,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState('decision-maker');
  const [message, setMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Auto-select best template depending on seniority
  useEffect(() => {
    if (!candidate) return;
    if (candidate.seniority_tier === 'Direct Decision Maker') {
      setSelectedTemplateId('decision-maker');
    } else {
      setSelectedTemplateId('peer-referral');
    }
  }, [candidate]);

  // Update text when template or candidate changes
  useEffect(() => {
    if (!candidate) return;
    const template = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
    setMessage(template.generateText(candidate, pitch));
    setIsCopied(false);
  }, [candidate, pitch, selectedTemplateId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  if (!candidate) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:p-6 z-50 text-white outline-none animate-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="font-display font-semibold text-base sm:text-lg text-white truncate">
                  Personalized Cold DM Generator
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-400 truncate">
                  Target: {candidate.name} ({candidate.position} at {candidate.company})
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

          {/* Template Selector Tabs */}
          <div className="mt-4">
            <label className="text-xs text-slate-400 font-medium block mb-2">Select Strategy Template:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`px-3 py-2 sm:py-2.5 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-medium shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">{tmpl.name}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tmpl.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Draft Message:</span>
              <span className="text-[11px] text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Customizable
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm text-slate-200 font-mono focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Footer Controls */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {candidate.url ? (
              <a
                href={candidate.url.startsWith('http') ? candidate.url : `https://${candidate.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors py-1"
              >
                <span className="truncate">View {candidate.name}'s Profile</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/30 active:scale-95 cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 shrink-0" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
