import { useBookingStore } from '../store/bookingStore';
import { useBookingSelection } from '../hooks/useBookingSelection';
import { calculatePackagePrice } from '../utils/pricing';
import { PackageCard } from './PackageCard';
import { StepHeading } from './StepHeading';

export function PackageSelector() {
  const { catalog, multiplier, selectedPackage } = useBookingSelection();
  const selectPackage = useBookingStore((s) => s.selectPackage);

  return (
    <div className="space-y-4 pt-4">
      <StepHeading
        step="Step 2 of 3"
        title="Choose Detailing Package"
        subtitle="All packages include eco-friendly PH-neutral detailing solutions and digital warranty"
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        role="radiogroup"
        aria-label="Detailing package"
      >
        {catalog.packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            price={calculatePackagePrice(pkg.basePrice, multiplier)}
            isSelected={selectedPackage.id === pkg.id}
            onSelect={() => selectPackage(pkg.id)}
          />
        ))}
      </div>
    </div>
  );
}
