import { Check } from 'lucide-react';

export function SelectedCheck() {
  return (
    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-yellow-300 text-black flex items-center justify-center font-extrabold shadow-md">
      <Check className="w-4 h-4 stroke-[3]" />
    </div>
  );
}
