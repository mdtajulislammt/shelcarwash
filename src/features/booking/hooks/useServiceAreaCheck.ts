import { useMutation } from '@tanstack/react-query';
import { serviceAreaService } from '@/services';

export function useServiceAreaCheck() {
  return useMutation({
    mutationFn: (zip: string) => serviceAreaService.checkZip(zip),
  });
}
