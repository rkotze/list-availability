import { format } from "date-fns";
import { DayAvailability } from "../utils/availability";

interface Props {
  data: DayAvailability[];
}

function formatDayAvailability(day: DayAvailability): string {
  const { date, slots } = day;

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    weekday: "long",
  };

  const formattedDate = date.toLocaleDateString("en-GB", options);

  const timeBlocks = slots.length
    ? slots
        .map(
          ({ start, end }) =>
            `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`
        )
        .join(", ")
    : "No availability";

  return `${formattedDate}: ${timeBlocks}`;
}

export default function AvailabilityEditor({ data }: Props) {
  // Build default text
  const text = data.map((day) => formatDayAvailability(day)).join("\n");

  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Suggested Availability</h2>
      <textarea
        className="w-full h-40 p-2 border rounded-md font-mono focus:outline-none focus:ring"
        defaultValue={text}
      />
    </div>
  );
}
