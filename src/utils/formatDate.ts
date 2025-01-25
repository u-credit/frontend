export function formatDate(
  date: Date | string | number | null,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  if (!date) {
    return '';
  }
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('th-TH', options).format(parsedDate);
}
