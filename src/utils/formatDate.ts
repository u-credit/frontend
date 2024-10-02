export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
}
