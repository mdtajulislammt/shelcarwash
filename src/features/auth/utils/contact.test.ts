import { describe, expect, it } from 'vitest';
import { maskContact, parseContact } from './contact';

describe('parseContact', () => {
  it('parses email and phone', () => {
    expect(parseContact(' Jane@Gmail.com ')).toEqual({ email: 'jane@gmail.com' });
    expect(parseContact('(925) 555-0100')).toEqual({ phone: '9255550100' });
    expect(parseContact('jane@')).toBeNull();
    expect(parseContact('555-01')).toBeNull();
  });

  it('masks contact', () => {
    expect(maskContact({ email: 'jane@gmail.com' })).toBe('j***@gmail.com');
    expect(maskContact({ phone: '9255550100' })).toBe('(***) ***-0100');
  });
});
