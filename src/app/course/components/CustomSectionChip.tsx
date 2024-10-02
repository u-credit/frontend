interface CustomSectionChipProps {
  day: number;
  sec: string;
}

const dayColorMap = [
  '#FFA8AA', // Sunday
  '#FFFAB0', // Monday
  '#FFC7F2', // Tuesday
  '#A4DCA9', // Wednesday
  '#FFB388', // Thursday
  '#88D9FF', // Friday
  '#D9C6FF', // Saturday
];

export default function CustomSectionChip({
  day,
  sec,
}: CustomSectionChipProps) {
  const secBackgroundColor = dayColorMap[day];
  const dayNames = [
    'วันอาทิตย์',
    'วันจันทร์',
    'วันอังคาร',
    'วันพุธ',
    'วันพฤหัสบดี',
    'วันศุกร์',
    'วันเสาร์',
  ];
  const dayName = dayNames[day] || 'Unknown';

  return (
    <div className="inline-flex items-center border border-gray-300 rounded-[4px] bg-transparent overflow-hidden w-fit h-fit">
      <div className="flex items-center px-[6px] bg-transparent text-gray-800">
        <span>{dayName}</span>
      </div>
      <div
        className="flex items-center px-[6px] bg-transparent text-gray-800 border-l border-gray-300"
        style={{ backgroundColor: secBackgroundColor }}
      >
        <span>{sec}</span>
      </div>
    </div>
  );
}
