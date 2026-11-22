import { Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE } from '@/config/site';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="bg-[#3a3a3a] border-t border-zinc-800/80 text-zinc-400 pt-10 pb-28 relative z-10">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-tr from-yellow-300 via-lime-300 to-lime-400 flex items-center justify-center font-extrabold text-black text-xs shadow-md shadow-yellow-300/20">
            CC
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">{SITE.longName}</p>
            <p className="text-xs text-zinc-400">
              Booking confirmation • Digital service certificate after completion
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 text-lime-300">
            <Award className="w-4 h-4" />
            <span>Digital Service Certificate</span>
          </div>
          <div className="flex items-center space-x-1.5 text-yellow-300">
            <Calendar className="w-4 h-4" />
            <span>Booking Confirmation</span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <nav aria-label="Legal" className="flex items-center gap-4 text-xs font-semibold">
            <Link
              to="/privacy"
              className="py-3.5 text-zinc-300 hover:text-yellow-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="py-3.5 text-zinc-300 hover:text-yellow-300 transition-colors"
            >
              Terms of Service
            </Link>
          </nav>
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
