import { Check, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { useBookingStore } from '../store/bookingStore';
import { useCatalog } from '../hooks/useCatalog';
import { AddOnIcon } from './icons';
import { SELECT_CARD, onActivateKey } from './selectableStyles';
import { StepHeading } from './StepHeading';

export function AddOns() {
  const { addOns } = useCatalog();
  const addonIds = useBookingStore((s) => s.addonIds);
  const toggleAddon = useBookingStore((s) => s.toggleAddon);
  const sorted = [...addOns].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-4 pt-4">
      <StepHeading
        step="Step 3 of 3"
        title="Optional Add-on Enhancements"
        subtitle="Customize your appointment with specialized restoration add-ons"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((addon) => {
          const isAdded = addonIds.includes(addon.id);
          return (
            <div
              key={addon.id}
              role="checkbox"
              aria-checked={isAdded}
              tabIndex={0}
              onClick={() => toggleAddon(addon.id)}
              onKeyDown={onActivateKey(() => toggleAddon(addon.id))}
              className={`${SELECT_CARD} p-4 cursor-pointer flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-card-chip text-card-chip-fg">
                    <AddOnIcon name={addon.icon} />
                  </div>
                  <div>
                    <h4 className="font-bold text-card-fg text-sm">{addon.name}</h4>
                    <p className="text-[11px] text-card-muted mt-0.5">
                      +{addon.durationMinutes} mins
                    </p>
                  </div>
                </div>
                <span className="font-bold text-card-accent text-sm">
                  +{formatCurrency(addon.price)}
                </span>
              </div>

              <p className="text-xs text-card-muted mt-3">{addon.description}</p>

              <div className="mt-4 pt-3 border-t border-current/15 flex items-center justify-between text-xs font-medium">
                <span className={`text-card-fg ${isAdded ? 'font-bold' : ''}`}>
                  {isAdded ? '✓ Added' : 'Add to service'}
                </span>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center font-bold bg-card-chip text-card-chip-fg">
                  {isAdded ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
