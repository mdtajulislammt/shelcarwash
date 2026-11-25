import { Car } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import type { CustomerField } from '../schemas';
import { useBookingStore } from '../store/bookingStore';

export type FieldErrors = Partial<Record<CustomerField, string>>;

interface FieldsProps {
  errors: FieldErrors;
  onChange: (field: CustomerField, value: string) => void;
}

/** Step 3: make / model / plate / year / color. */
export function VehicleSpecsFields({ errors, onChange }: FieldsProps) {
  const c = useBookingStore((s) => s.customer);

  return (
    <div className="space-y-4 border-t border-zinc-800 pt-6">
      <h3 className="text-base font-bold text-white flex items-center space-x-2">
        <Car className="w-4 h-4 text-brand" />
        <span>3. Vehicle Specifications</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Make *"
          name="vehicleMake"
          placeholder="e.g. Porsche / BMW / Ford"
          value={c.vehicleMake}
          error={errors.vehicleMake}
          onChange={(e) => onChange('vehicleMake', e.target.value)}
        />
        <Input
          label="Model *"
          name="vehicleModel"
          placeholder="e.g. 911 GT3 / M4 / F-150"
          value={c.vehicleModel}
          error={errors.vehicleModel}
          onChange={(e) => onChange('vehicleModel', e.target.value)}
        />
        <Input
          label="License Plate *"
          name="licensePlate"
          placeholder="e.g. 7XYZ89"
          value={c.licensePlate}
          error={errors.licensePlate}
          onChange={(e) => onChange('licensePlate', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Vehicle Year"
          name="vehicleYear"
          inputMode="numeric"
          placeholder="2024"
          value={c.vehicleYear}
          onChange={(e) => onChange('vehicleYear', e.target.value)}
        />
        <Input
          label="Paint Color"
          name="vehicleColor"
          placeholder="e.g. Metallic Black / Alpine White"
          value={c.vehicleColor}
          onChange={(e) => onChange('vehicleColor', e.target.value)}
        />
      </div>
    </div>
  );
}
