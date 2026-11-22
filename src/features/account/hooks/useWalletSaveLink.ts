import { useMutation } from '@tanstack/react-query';
import { walletService } from '@/services';

export function useWalletSaveLink() {
  return useMutation({ mutationFn: (passIds: string[]) => walletService.createSaveLink(passIds) });
}
