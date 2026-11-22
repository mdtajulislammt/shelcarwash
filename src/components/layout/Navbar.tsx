import { CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '@/assets/images/logo.jpg';
import { SITE } from '@/config/site';
import { Container } from './Container';

/** Sticky top header: brand + "My Bookings" shortcut. */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-zinc-800/80 text-zinc-100">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          <Link
            to="/"
            aria-label={`${SITE.name} home`}
            className="flex items-center min-h-11 space-x-2 sm:space-x-3 cursor-pointer group min-w-0"
          >
            <img
              src={logoImg}
              alt="Constant Clean Mobile Auto Detailing"
              className="h-10 sm:h-12 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-200 border border-yellow-400/30 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                  CONSTANT CLEAN
                </span>
                <span className="hidden min-[380px]:inline text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-yellow-300/10 text-yellow-300 border border-yellow-300/30 whitespace-nowrap">
                  Auto Detailing
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                Booking confirmation & digital service certificates
              </p>
            </div>
          </Link>

          <Link
            to="/bookings"
            aria-label="My Bookings"
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 min-h-11 min-w-11 justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer shrink-0"
          >
            <div className="w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <span className="text-[11px] font-bold text-white block">My Bookings</span>
              <span className="text-[9px] text-lime-400 font-medium block">Manage & cancel</span>
            </div>
          </Link>
        </div>
      </Container>
    </header>
  );
}
