import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { useAccount } from '../hooks/useAccount';
import { useDeleteManualEvent } from '../hooks/useAccountData';
import type { AccountSettings } from '../schemas';
import { formatVehicle } from '../utils/profile';
import { AccountLookup } from './AccountLookup';
import { AddEventModal } from './AddEventModal';
import { AppointmentCalendar } from './AppointmentCalendar';
import { ProfileHeader } from './ProfileHeader';
import { ServiceMapCard } from './ServiceMapCard';
import { SettingsModal } from './SettingsModal';
import { UpcomingAppointments } from './UpcomingAppointments';
import { VerifiedAddressCard } from './VerifiedAddressCard';

/** Customer profile: contact details, calendar (bookings + personal events), service address. */
export function MyAccount({ onBook }: { onBook: () => void }) {
  const account = useAccount();
  const { lookup, profile, bookings, schedule, settings, serviceAddress, isLoading, error } =
    account;
  const clearLookup = useLookupStore((s) => s.clearLookup);
  const deleteEvent = useDeleteManualEvent();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center" aria-live="polite">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-6 space-y-4">
        {error && <p className="text-xs text-rose-400 text-center">{error.message}</p>}
        <AccountLookup
          notFoundFor={lookup?.email ?? lookup?.phone ?? null}
          onSignOut={clearLookup}
          onBook={onBook}
        />
      </div>
    );
  }

  const lastCustomer = bookings[0]?.customer;
  const lastMobile = bookings.find((b) => b.customer.serviceType === 'mobile')?.customer;
  const initialSettings: AccountSettings = settings ?? {
    fullName: profile.fullName,
    phone: profile.phone,
    streetAddress: lastMobile?.streetAddress ?? '',
    city: lastMobile?.city ?? '',
    zipCode: lastMobile?.zipCode ?? '',
    smsReminders: true,
    emailUpdates: true,
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6">
      <ProfileHeader
        profile={profile}
        isVerified={account.isVerified}
        bookingCount={bookings.length}
        onOpenSettings={() => setSettingsOpen(true)}
        onSignOut={clearLookup}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppointmentCalendar key={schedule[0]?.id ?? 'none'} schedule={schedule} onBook={onBook} />
        <ServiceMapCard address={serviceAddress} />
        <UpcomingAppointments
          schedule={schedule}
          onBook={onBook}
          onAddEvent={() => setAddEventOpen(true)}
          onDeleteEvent={(id) => deleteEvent.mutate(id)}
          deletingId={deleteEvent.isPending ? (deleteEvent.variables ?? null) : null}
        />
        <VerifiedAddressCard address={serviceAddress} onEdit={() => setSettingsOpen(true)} />
      </div>

      {settingsOpen && (
        <SettingsModal
          open
          initial={initialSettings}
          email={profile.email || profile.phone}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <AddEventModal
        open={addEventOpen}
        defaultVehicle={lastCustomer ? formatVehicle(lastCustomer) : ''}
        onClose={() => setAddEventOpen(false)}
      />
    </div>
  );
}
