import { useState } from "react";
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

  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Copied to clipboard!");
      setTimeout(() => setCopySuccess(null), 2000); // Clear success message after 2 seconds
    } catch (err) {
      setCopySuccess("Failed to copy!");
      setTimeout(() => setCopySuccess(null), 2000); // Clear error message after 2 seconds
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Suggested Availability</h2>
      <textarea
        className="w-full h-40 p-2 border rounded-md font-mono focus:outline-none focus:ring"
        defaultValue={text}
        readOnly
      />
      <div className="mt-2 flex items-center">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring"
        >
          Copy to Clipboard
        </button>
        {copySuccess && (
          <span className="ml-4 text-sm text-green-600">{copySuccess}</span>
        )}
      </div>
    </div>
  );
}
