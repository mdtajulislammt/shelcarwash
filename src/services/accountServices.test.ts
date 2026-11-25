import { beforeEach, describe, expect, it } from 'vitest';
import { createMockAccountService } from './accountService';
import { createMockAuthService } from './authService';

describe('mock auth service', () => {
  it('signs in with the one-time code only', async () => {
    const auth = createMockAuthService({ latencyMs: 0 });
    const contact = { email: 'jane@example.com' };
    const { sentTo, devCode } = await auth.requestCode(contact);
    expect(sentTo).toBe('j***@example.com');
    const wrong = devCode === '000000' ? '111111' : '000000';
    await expect(auth.verifyCode(contact, wrong)).rejects.toMatchObject({ code: 'INVALID_CODE' });
    const session = await auth.verifyCode(contact, devCode!);
    expect(session.email).toBe('jane@example.com');
    expect(session.token).toMatch(/^mock_session/);
    await expect(auth.verifyCode(contact, devCode!)).rejects.toMatchObject({
      code: 'CODE_EXPIRED',
    });
  });
});

describe('mock account service', () => {
  beforeEach(() => localStorage.clear());
  const account = createMockAccountService({ latencyMs: 0 });

  it('saves notification settings per customer', async () => {
    const settings = { smsReminders: false, emailUpdates: true };
    await account.updateSettings('jane@example.com', settings);
    expect(await account.getSettings('jane@example.com')).toEqual(settings);
    expect(await account.getSettings('other@example.com')).toBeNull();
  });

  it('adds and deletes manual events', async () => {
    const ev = await account.addEvent('jane@example.com', {
      title: 'Tire rotation',
      date: '2026-11-30',
      startTime: '09:00',
      endTime: '10:00',
      vehicle: '',
      location: '',
      notes: '',
    });
    expect(await account.listEvents('jane@example.com')).toHaveLength(1);
    await account.deleteEvent('jane@example.com', ev.id);
    expect(await account.listEvents('jane@example.com')).toHaveLength(0);
  });
});
