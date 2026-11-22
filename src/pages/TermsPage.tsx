import { LegalPage } from '@/components/layout/LegalPage';
import { CANCELLATION_POLICY, SERVICE_AREA_CITIES, SITE } from '@/config/site';

export function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="November 2026">
      <section>
        <h2>Bookings & service area</h2>
        <p>
          {SITE.legalName} provides mobile auto detailing in {SERVICE_AREA_CITIES.join(', ')}.
          Appointments are booked in arrival windows (8:00–11:00 AM, 11:00 AM–2:00 PM, 2:00–5:00 PM,
          Pacific Time), seven days a week.
        </p>
      </section>
      <section>
        <h2>Prepayment</h2>
        <p>
          Every service is prepaid. Card and Google Pay bookings are confirmed immediately. Zelle
          and Venmo bookings are held as <strong>Pending payment</strong> until we receive the
          transfer.
        </p>
      </section>
      <section>
        <h2>Cancellation & satisfaction</h2>
        <p>{CANCELLATION_POLICY.text}</p>
      </section>
      <section>
        <h2>Pricing</h2>
        <p>
          Package prices adjust by vehicle category. Add-ons are priced individually. Vehicles in
          unusually heavy condition may require an updated quote, which we will always confirm with
          you before starting.
        </p>
      </section>
      <section>
        <h2>Access & vehicle condition</h2>
        <p>
          Please provide access to the vehicle and, for mobile service, a safe place to work. We are
          not responsible for pre-existing damage or personal items left in the vehicle.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions? Reach us at <strong>{SITE.email}</strong> or <strong>{SITE.phone}</strong>.
        </p>
      </section>
    </LegalPage>
  );
}
