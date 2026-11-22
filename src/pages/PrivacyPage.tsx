import { LegalPage } from '@/components/layout/LegalPage';
import { SITE } from '@/config/site';

export function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="November 2026">
      <section>
        <h2>Information we collect</h2>
        <p>
          When you book with {SITE.legalName}, we collect the details needed to perform your
          service: your name, email, phone number, service address, ZIP code, vehicle details (make,
          model, year, color, license plate), appointment date and time, and any notes you add.
        </p>
      </section>
      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To schedule, perform and follow up on your detailing appointment.</li>
          <li>To send your booking confirmation, reminders and service updates.</li>
          <li>To issue your digital service certificate after completion.</li>
          <li>To process payments and handle cancellations or re-service requests.</li>
        </ul>
      </section>
      <section>
        <h2>Payments</h2>
        <p>
          Card and Google Pay payments are processed by our payment provider; we never store full
          card numbers. Zelle and Venmo payments are sent directly to our business account.
        </p>
      </section>
      <section>
        <h2>Sharing</h2>
        <p>
          We do not sell your personal information. We share it only with service providers that
          help us run the business (payments, messaging, hosting) and only as needed to provide your
          service, or when required by law.
        </p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>
          You can ask us to access, correct or delete your information at any time by contacting{' '}
          <strong>{SITE.email}</strong> or <strong>{SITE.phone}</strong>. California residents have
          additional rights under the CCPA.
        </p>
      </section>
    </LegalPage>
  );
}
