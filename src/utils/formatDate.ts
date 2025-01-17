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

<<<<<<< HEAD
  return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
=======
  return new Intl.DateTimeFormat('th-TH', options).format(parsedDate);
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
}
