import { useBookingStore } from '../store/bookingStore';
import { useCatalog } from '../hooks/useCatalog';
import { formatMultiplier } from '../utils/pricing';
import { VehicleIcon } from './icons';
import { SelectedCheck } from './SelectedCheck';
import { IDLE_CARD, SELECTED_CARD, onActivateKey } from './selectableStyles';
import { StepHeading } from './StepHeading';

export function VehicleSelector() {
  const { vehicles } = useCatalog();
  const selected = useBookingStore((s) => s.vehicle);
  const setVehicle = useBookingStore((s) => s.setVehicle);

  return (
    <div className="space-y-4">
      <StepHeading
        step="Step 1 of 3"
        title="Select Your Vehicle Category"
        aside={
          <span className="text-xs text-zinc-400 hidden sm:inline-block">
            Prices adjust automatically by vehicle size
          </span>
        }
      />

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        role="radiogroup"
        aria-label="Vehicle category"
      >
        {vehicles.map((veh) => {
          const isSelected = selected === veh.id;
          return (
            <div
              key={veh.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setVehicle(veh.id)}
              onKeyDown={onActivateKey(() => setVehicle(veh.id))}
              className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border text-left ${
                isSelected
                  ? `${SELECTED_CARD} ring-2 ring-yellow-300/40 shadow-lg shadow-yellow-300/20`
                  : IDLE_CARD
              }`}
            >
              {isSelected && <SelectedCheck />}
              <div
                className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                  isSelected
                    ? 'bg-yellow-300/20 text-yellow-300 border border-yellow-300/30'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <VehicleIcon name={veh.iconName} />
              </div>
              <h3 className="font-bold text-white text-base">{veh.name}</h3>
              <p className="text-xs text-zinc-400 mt-1">{veh.description}</p>
              <div className="mt-3 text-[11px] font-semibold text-zinc-400">
                Multiplier:{' '}
                <span className="text-yellow-300 font-bold">
                  {formatMultiplier(veh.priceMultiplier)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
