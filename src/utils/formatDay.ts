export function formatThaiDay(day: number): string {
  if (day === 0) return 'อาทิตย์';
  else if (day === 1) return 'จันทร์';
  else if (day === 2) return 'อังคาร';
  else if (day === 3) return 'พุธ';
  else if (day === 4) return 'พฤหัสบดี';
  else if (day === 5) return 'ศุกร์';
  else if (day === 6) return 'เสาร์';
  return '';
}

export function formatShortThaiDay(day: number): string {
  if (day === 0) return 'อา.';
  else if (day === 1) return 'จ.';
  else if (day === 2) return 'อ.';
  else if (day === 3) return 'พ.';
  else if (day === 4) return 'พฤ.';
  else if (day === 5) return 'ศ.';
  else if (day === 6) return 'ส.';
  return '';
}
