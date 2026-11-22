import { Car, MapPin, ShieldCheck } from 'lucide-react';
import { SITE } from '@/config/site';
import type { ServiceType } from '@/types';
import { useBookingStore } from '../store/bookingStore';
import { onActivateKey } from './selectableStyles';

const OPTIONS: Array<{
  id: ServiceType;
  title: string;
  subtitle: string;
  icon: typeof Car;
  iconClass: string;
}> = [
  {
    id: 'mobile',
    title: 'Mobile Detailing',
    subtitle: 'We come to your home or office',
    icon: Car,
    iconClass: 'bg-yellow-300/10 text-yellow-300',
  },
  {
    id: 'studio',
    title: 'Constant Clean Studio Drop-off',
    subtitle: `Drop off at ${SITE.studioAddress}`,
    icon: ShieldCheck,
    iconClass: 'bg-lime-400/10 text-lime-400',
  },
];

export function ServiceLocation() {
  const serviceType = useBookingStore((s) => s.customer.serviceType);
  const updateCustomer = useBookingStore((s) => s.updateCustomer);

  return (
    <div className="space-y-4 border-t border-zinc-800 pt-6">
      <h3 className="text-base font-bold text-white flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-yellow-300" />
        <span>2. Service Location</span>
      </h3>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        role="radiogroup"
        aria-label="Service location"
      >
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = serviceType === opt.id;
          const select = () => updateCustomer('serviceType', opt.id);
          return (
            <div
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={select}
              onKeyDown={onActivateKey(select)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-zinc-800 border-yellow-300 ring-1 ring-yellow-300/30'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${opt.iconClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{opt.title}</h4>
                  <p className="text-xs text-zinc-400">{opt.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
