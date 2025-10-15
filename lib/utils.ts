import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format BDT amount from paisa (integer) to readable string
 * @param paisa - Amount in paisa (BDT * 100)
 * @returns Formatted string like "৳1,234.56"
 */
export function formatBDT(paisa: number): string {
  const bdt = paisa / 100;
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  }).format(bdt);
}

/**
 * Convert BDT to paisa
 */
export function bdtToPaisa(bdt: number): number {
  return Math.round(bdt * 100);
}

/**
 * Convert paisa to BDT
 */
export function paisaToBdt(paisa: number): number {
  return paisa / 100;
}

/**
 * Get month name from month number (1-12)
 */
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
}

/**
 * Get current year and month
 */
export function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

/**
 * Validate month format YYYY-MM
 */
export function parseMonthParam(monthParam: string): { year: number; month: number } | null {
  const match = monthParam.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  
  if (month < 1 || month > 12) return null;
  
  return { year, month };
}

