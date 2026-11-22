import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { BUTTON_VARIANTS } from '@/components/ui/buttonVariants';

export function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto py-24 text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-yellow-300/10 text-yellow-300 border border-yellow-300/20 flex items-center justify-center mx-auto">
        <Sparkles className="w-7 h-7" />
      </div>
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-1">Page not found</h1>
        <p className="text-zinc-400 text-sm mt-2">
          The page you're looking for doesn't exist or has moved.
        </p>
      </div>
      <Link
        to="/"
        className={`${BUTTON_VARIANTS.primary} inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-yellow-300/20 transition-all`}
      >
        Back to Services & Pricing
      </Link>
    </div>
  );
}
