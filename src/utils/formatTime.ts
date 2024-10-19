export function formatTeachTime(start: string, end: string): string {
  const startTime = start.slice(0, 5);
  const endTime = end.slice(0, 5);
  return `${startTime} - ${endTime}`;
}

export function formatTeachTimeStr(timeStr: string): string {
  const timeRegex = /(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/;

  const match = timeStr.match(timeRegex);

  if (match && match.length === 3) {
    const startTime = match[1];
    const endTime = match[2];
    return `${startTime} - ${endTime}`;
  }

  return '';
}
