export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format amount as currency with Taka symbol
 * @param amount - Amount in BDT/Taka
 * @returns Formatted string like "৳1,234"
 */
export function formatBDT(amount: number): string {
  return '৳' + Math.round(amount).toLocaleString('en-US');
}

/**
 * Convert BDT to paisa (kept for backward compatibility)
 * @deprecated No longer needed as amounts are stored directly
 */
export function bdtToPaisa(bdt: number): number {
  return bdt; // No conversion needed
}

/**
 * Convert paisa to BDT (kept for backward compatibility)
 * @deprecated No longer needed as amounts are stored directly
 */
export function paisaToBdt(paisa: number): number {
  return paisa; // No conversion needed
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

