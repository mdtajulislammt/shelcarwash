import { AddOns } from './AddOns';
import { BookingSummaryBar } from './BookingSummaryBar';
import { PackageSelector } from './PackageSelector';
import { VehicleSelector } from './VehicleSelector';

/** Steps 1–3 of the booking flow (vehicle, package, add-ons) + sticky summary. */
export function ServiceSelector({ onContinue }: { onContinue: () => void }) {
  return (
    <div id="services-section" className="space-y-12 py-8">
      <VehicleSelector />
      <PackageSelector />
      <AddOns />
      <BookingSummaryBar onContinue={onContinue} />
    </div>
  );
}
