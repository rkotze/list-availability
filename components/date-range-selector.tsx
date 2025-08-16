interface Props {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export default function DateRangeSelector({
  startDate,
  endDate,
  onChange,
}: Props) {
  return (
    <div className="flex gap-4 mt-4">
      <label className="flex-1">
        <span className="block text-sm font-medium">Start Date</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange(e.target.value, endDate)}
          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring"
        />
      </label>
      <label className="flex-1">
        <span className="block text-sm font-medium">End Date</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange(startDate, e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring"
        />
      </label>
    </div>
  );
}
