import { Check, Clock, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { Package } from '@/types';
import { SelectedCheck } from './SelectedCheck';
import { SELECT_CARD, onActivateKey } from './selectableStyles';

interface PackageCardProps {
  pkg: Package;
  price: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function PackageCard({ pkg, price, isSelected, onSelect }: PackageCardProps) {
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onActivateKey(onSelect)}
      className={`${SELECT_CARD} relative p-6 sm:p-7 cursor-pointer flex flex-col justify-between`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-accent-red text-ink text-[10px] font-extrabold tracking-wider uppercase shadow-md flex items-center space-x-1">
          <Star className="w-3 h-3 fill-ink text-ink" />
          <span>Most Popular</span>
        </div>
      )}

      {isSelected && <SelectedCheck />}

      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-card-fg flex items-center space-x-2">
              <span>{pkg.name}</span>
            </h3>
            <p className="text-xs text-card-accent font-medium mt-0.5">{pkg.tagline}</p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-card-fg">{formatCurrency(price)}</div>
            <div className="text-[11px] text-card-muted font-medium flex items-center justify-end space-x-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>~{pkg.durationMinutes} mins</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-card-muted mt-3 leading-relaxed">{pkg.description}</p>

        <div className="mt-5 space-y-2 border-t border-current/15 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-card-muted block">
            Included In Package:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {pkg.features.map((feat) => (
              <div key={feat} className="flex items-start space-x-2 text-card-fg">
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-card-accent" />
                <span className="text-[11px] leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-current/15 flex items-center justify-between">
        <span className={`text-xs text-card-fg ${isSelected ? 'font-bold' : 'font-medium'}`}>
          {isSelected ? '✓ Currently Selected' : 'Click to Select'}
        </span>
        <div className="px-4 py-2 rounded-xl text-xs font-extrabold bg-card-chip text-card-chip-fg">
          {isSelected ? 'Selected' : 'Select Package'}
        </div>
      </div>
    </div>
  );
}
