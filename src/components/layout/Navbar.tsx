import { UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '@/assets/images/logo.png';
import { SITE } from '@/config/site';
import { ProfileAvatar } from '@/features/account/components/ProfileAvatar';
import { useAccount } from '@/features/account/hooks/useAccount';
import { Container } from './Container';

/** Sticky top header: brand + customer profile shortcut. */
export function Navbar() {
  const { profile, upcoming } = useAccount();
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-card-border text-white">
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
              width={517}
              height={284}
              className="h-11 sm:h-14 w-auto shrink-0 group-hover:scale-105 transition-transform duration-200"
            />
            <p className="hidden md:block text-xs text-muted font-semibold uppercase tracking-wider border-l border-card-border pl-3">
              Booking confirmation & digital service certificates
            </p>
          </Link>

          <Link
            to="/account"
            aria-label="My Account"
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 min-h-11 min-w-11 justify-center rounded-xl bg-surface-4/60 hover:bg-card-hover border border-card-border transition-colors cursor-pointer shrink-0"
          >
            {profile ? (
              <ProfileAvatar name={profile.fullName} className="w-6 h-6 text-[9px]" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-brand text-ink flex items-center justify-center">
                <UserRound className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="text-left leading-tight">
              <span className="text-[11px] font-bold text-white uppercase tracking-wide block">
                {profile?.fullName ?? 'My Account'}
              </span>
              <span className="text-[10px] text-muted font-medium block">
                {profile
                  ? `${upcoming.length} upcoming appointment${upcoming.length === 1 ? '' : 's'}`
                  : 'Profile & bookings'}
              </span>
            </div>
          </Link>
        </div>
      </Container>
    </header>
  );
}
