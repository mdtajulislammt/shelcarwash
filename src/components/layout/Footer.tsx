import { Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '@/assets/images/logo.png';
import { SITE } from '@/config/site';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="bg-card border-t border-card-border text-muted pt-10 pb-28 relative z-10">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <img
            src={logoImg}
            alt="Constant Clean Mobile Auto Detailing"
            width={517}
            height={284}
            loading="lazy"
            className="h-10 w-auto shrink-0"
          />
          <div>
            <p className="text-sm font-bold text-white tracking-tight">{SITE.longName}</p>
            <p className="text-xs text-muted">
              Booking confirmation • Digital service certificate after completion
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 text-lime-300">
            <Award className="w-4 h-4" />
            <span>Digital Service Certificate</span>
          </div>
          <div className="flex items-center space-x-1.5 text-brand">
            <Calendar className="w-4 h-4" />
            <span>Booking Confirmation</span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <nav aria-label="Legal" className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/privacy" className="py-3.5 text-white hover:text-brand transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="py-3.5 text-white hover:text-brand transition-colors">
              Terms of Service
            </Link>
          </nav>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
