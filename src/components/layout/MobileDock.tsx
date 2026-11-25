import { NavLink } from 'react-router-dom';
import { ProfileAvatar } from '@/features/account/components/ProfileAvatar';
import { useAccount } from '@/features/account/hooks/useAccount';
import { getFirstName } from '@/features/account/utils/profile';
import { NAV_ITEMS } from './navItems';

/** Fixed bottom navigation dock (all breakpoints). */
export function MobileDock() {
  const { bookings, profile } = useAccount();
  const activeCount = bookings.filter((b) => b.status !== 'cancelled').length;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl md:max-w-3xl px-2">
      <nav
        aria-label="Main"
        className="bg-card/95 backdrop-blur-xl p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-card-border shadow-card flex items-center justify-between gap-0.5 sm:gap-1"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const badge = item.showBookingCount ? activeCount : 0;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex-1 min-w-0 md:min-w-fit min-h-11 py-2 sm:py-2.5 px-0.5 sm:px-3 rounded-xl text-xs text-white uppercase transition-colors flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 relative hover:bg-card-hover ${
                  isActive ? 'font-extrabold' : 'font-semibold'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.isAccount && profile ? (
                    <ProfileAvatar
                      name={profile.fullName}
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-[7px] sm:text-[8px] ${isActive ? 'ring-1 ring-brand' : ''}`}
                    />
                  ) : item.to === '/' ? (
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand fill-brand/30' : 'text-white'}`}
                    />
                  ) : (
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand' : 'text-white'}`}
                    />
                  )}
                  <span className="truncate max-w-full text-[10px] sm:text-xs tracking-wide">
                    {item.isAccount && profile?.hasName ? (
                      <span
                        title={profile.fullName}
                        className="block truncate max-w-[4.5rem] sm:max-w-[5.5rem]"
                      >
                        {getFirstName(profile.fullName)}
                      </span>
                    ) : (
                      <>
                        <span className="hidden sm:inline">{item.label}</span>
                        <span className="sm:hidden">{item.shortLabel}</span>
                      </>
                    )}
                  </span>
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-8 sm:w-10 rounded-full bg-accent-red"
                    />
                  )}
                  {badge > 0 && (
                    <span
                      className={`absolute top-1 right-1 sm:static ml-0.5 sm:ml-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                        isActive ? 'bg-brand text-ink' : 'bg-ink text-white'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
