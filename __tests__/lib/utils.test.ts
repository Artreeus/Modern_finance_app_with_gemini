import { formatBDT, bdtToPaisa, paisaToBdt, parseMonthParam } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatBDT', () => {
    it('should format paisa to BDT currency string', () => {
      expect(formatBDT(100000)).toContain('1,000');
      expect(formatBDT(50)).toContain('0.50');
      expect(formatBDT(123456)).toContain('1,234.56');
    });
  });

  describe('bdtToPaisa', () => {
    it('should convert BDT to paisa', () => {
      expect(bdtToPaisa(100)).toBe(10000);
      expect(bdtToPaisa(1.5)).toBe(150);
      expect(bdtToPaisa(0.01)).toBe(1);
    });

    it('should round to nearest integer', () => {
      expect(bdtToPaisa(1.234)).toBe(123);
      expect(bdtToPaisa(1.239)).toBe(124);
    });
  });

  describe('paisaToBdt', () => {
    it('should convert paisa to BDT', () => {
      expect(paisaToBdt(10000)).toBe(100);
      expect(paisaToBdt(150)).toBe(1.5);
      expect(paisaToBdt(1)).toBe(0.01);
    });
  });

  describe('parseMonthParam', () => {
    it('should parse valid month format', () => {
      expect(parseMonthParam('2024-01')).toEqual({ year: 2024, month: 1 });
      expect(parseMonthParam('2024-12')).toEqual({ year: 2024, month: 12 });
      expect(parseMonthParam('2025-06')).toEqual({ year: 2025, month: 6 });
    });

    it('should reject invalid formats', () => {
      expect(parseMonthParam('2024-13')).toBeNull();
      expect(parseMonthParam('2024-00')).toBeNull();
      expect(parseMonthParam('invalid')).toBeNull();
      expect(parseMonthParam('2024/01')).toBeNull();
      expect(parseMonthParam('24-01')).toBeNull();
    });
  });
});

