export function formatTeachTime(start: string, end: string): string {
  const startTime = start.slice(0, 5);
  const endTime = end.slice(0, 5);
<<<<<<< HEAD
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
=======
  return `${startTime}-${endTime}`;
}

export function formatTeachTimeStr(timeStr: string): string {
  const daysMap: Record<string, string> = {
    '1': 'อา.',
    '2': 'จ.',
    '3': 'อ.',
    '4': 'พ.',
    '5': 'พฤ.',
    '6': 'ศ.',
    '7': 'ส.',
  };

  const segments = timeStr.split(',');

  const formattedSegments = segments.map((segment) => {
    const [dayPart, timePart] = segment.split('x');
    const day = daysMap[dayPart] || '';
    return timePart ? `${day} ${timePart}` : '';
  });

  return formattedSegments.join('\n+ ');
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
}
