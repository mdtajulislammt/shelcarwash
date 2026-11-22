import { Car, CarFront, Dog, Droplets, Gauge, Sparkles, Sun, Truck, Wind } from 'lucide-react';

export function AddOnIcon({ name }: { name: string }) {
  switch (name) {
    case 'Sun':
      return <Sun className="w-4 h-4 text-yellow-300" />;
    case 'Dog':
      return <Dog className="w-4 h-4 text-yellow-300" />;
    case 'Gauge':
      return <Gauge className="w-4 h-4 text-lime-400" />;
    case 'Wind':
      return <Wind className="w-4 h-4 text-lime-400" />;
    case 'Droplets':
      return <Droplets className="w-4 h-4 text-lime-300" />;
    default:
      return <Sparkles className="w-4 h-4 text-yellow-300" />;
  }
}

export function VehicleIcon({ name }: { name: string }) {
  switch (name) {
    case 'Car':
      return <Car className="w-5 h-5" />;
    case 'CarFront':
      return <CarFront className="w-5 h-5" />;
    case 'Truck':
      return <Truck className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
}
