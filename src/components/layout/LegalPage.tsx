import type { ReactNode } from 'react';
import { FileText } from 'lucide-react';

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}

/** Dark long-form page used by Privacy and Terms (same look as the gallery header + cards). */
export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-yellow-300/10 text-yellow-300 border border-yellow-300/20">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
            {eyebrow}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-2">{title}</h1>
        <p className="text-zinc-400 text-sm mt-1">Last updated: {updated}</p>
      </div>
      <div className="bg-[#0f0f13] rounded-3xl border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6 text-sm text-zinc-300 leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-white">
        {children}
      </div>
    </div>
  );
}
