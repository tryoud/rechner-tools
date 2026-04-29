import { describe, it, expect } from 'vitest';
import { calculateStundenrechner } from './calculators';

describe('calculateStundenrechner', () => {
  it('calculates industrial hours and pay correctly', () => {
    const result = calculateStundenrechner({
      hourlyRate: 50,
      entries: [
        {
          id: '1',
          date: '2026-05-01',
          startTime: '08:00',
          endTime: '16:30',
          breakMinutes: 30, // 8 hours net
        },
      ],
    });

    expect(result.decimalHours).toBe(8);
    expect(result.formattedTime).toBe('8h 00m');
    expect(result.grossPay).toBe(400); // 8 * 50
    expect(result.entryCount).toBe(1);
  });

  it('handles overnight shifts correctly', () => {
    const result = calculateStundenrechner({
      hourlyRate: 20,
      entries: [
        {
          id: '2',
          date: '2026-05-02',
          startTime: '22:00',
          endTime: '06:00',
          breakMinutes: 0, // 8 hours net
        },
      ],
    });

    expect(result.decimalHours).toBe(8);
    expect(result.grossPay).toBe(160);
  });

  it('handles industrial minutes like 45 mins = 0.75 hours', () => {
    const result = calculateStundenrechner({
      hourlyRate: 100,
      entries: [
        {
          id: '3',
          date: '2026-05-03',
          startTime: '09:00',
          endTime: '09:45',
          breakMinutes: 0, // 45 mins
        },
      ],
    });

    expect(result.decimalHours).toBe(0.75);
    expect(result.grossPay).toBe(75);
    expect(result.formattedTime).toBe('0h 45m');
  });
});
