export function formatTeachTime(start: string, end: string): string {
  const startTime = start.slice(0, 5);
  const endTime = end.slice(0, 5);
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
}
