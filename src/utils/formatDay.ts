export function formatThaiDay(day: number): string {
  if (day === 0) return '';
  else if (day === 1) return 'อาทิตย์';
  else if (day === 2) return 'จันทร์';
  else if (day === 3) return 'อังคาร';
  else if (day === 4) return 'พุธ';
  else if (day === 5) return 'พฤหัสบดี';
  else if (day === 6) return 'ศุกร์';
  else if (day === 7) return 'เสาร์';
  return '';
}

export function formatShortThaiDay(day: number): string {
  if (day === 0) return '';
  else if (day === 1) return 'อา.';
  else if (day === 2) return 'จ.';
  else if (day === 3) return 'อ.';
  else if (day === 4) return 'พ.';
  else if (day === 5) return 'พฤ.';
  else if (day === 6) return 'ศ.';
  else if (day === 7) return 'ส.';
  return '';
}
