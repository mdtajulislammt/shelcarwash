import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactKey, useLookupStore } from '@/features/bookings/store/lookupStore';
import { queryKeys } from '@/lib/api/queryKeys';
import { accountService } from '@/services';
import type { AccountSettings, ManualEventInput } from '../schemas';

function useContact(): string {
  return useLookupStore((s) => contactKey(s.lookup));
}

export function useAccountSettings() {
  const contact = useContact();
  return useQuery({
    queryKey: queryKeys.accountSettings(contact),
    queryFn: () => accountService.getSettings(contact),
    enabled: !!contact,
  });
}

export function useUpdateAccountSettings() {
  const contact = useContact();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: AccountSettings) => accountService.updateSettings(contact, settings),
    onSuccess: (saved) => queryClient.setQueryData(queryKeys.accountSettings(contact), saved),
  });
}

export function useManualEvents() {
  const contact = useContact();
  return useQuery({
    queryKey: queryKeys.accountEvents(contact),
    queryFn: () => accountService.listEvents(contact),
    enabled: !!contact,
  });
}

export function useAddManualEvent() {
  const contact = useContact();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ManualEventInput) => accountService.addEvent(contact, input),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.accountEvents(contact) }),
  });
}

export function useDeleteManualEvent() {
  const contact = useContact();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountService.deleteEvent(contact, id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.accountEvents(contact) }),
  });
}
