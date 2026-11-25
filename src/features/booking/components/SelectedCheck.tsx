import { Check } from 'lucide-react';

export function SelectedCheck() {
  return (
    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-ink text-brand flex items-center justify-center font-extrabold shadow-md">
      <Check className="w-4 h-4 stroke-[3]" />
    </div>
  );
}
