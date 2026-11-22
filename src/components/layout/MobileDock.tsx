import { NavLink } from 'react-router-dom';
import { useBookings } from '@/features/bookings/hooks/useBookings';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { NAV_ITEMS } from './navItems';

/** Fixed bottom navigation dock (all breakpoints). */
export function MobileDock() {
  const lookup = useLookupStore((s) => s.lookup);
  const { data: bookings } = useBookings(lookup);
  const activeCount = (bookings ?? []).filter((b) => b.status !== 'cancelled').length;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl px-2">
      <nav
        aria-label="Main"
        className="bg-[#18181c]/95 backdrop-blur-xl p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-zinc-700/80 shadow-2xl shadow-black/80 flex items-center justify-between gap-1"
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
                `flex-1 min-w-0 min-h-11 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl text-xs transition-all flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 relative ${
                  isActive
                    ? 'bg-[#38383e] text-white font-extrabold border border-zinc-500 shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-semibold'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.to === '/' ? (
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-yellow-300 fill-yellow-300/30' : 'text-zinc-400'}`}
                    />
                  ) : (
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-yellow-400' : 'text-zinc-400'}`}
                    />
                  )}
                  <span className="truncate max-w-full text-[10px] sm:text-xs tracking-tight">
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.shortLabel}</span>
                  </span>
                  {badge > 0 && (
                    <span
                      className={`absolute top-1 right-1 sm:static ml-0.5 sm:ml-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                        isActive ? 'bg-lime-400 text-black' : 'bg-zinc-700 text-zinc-300'
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
