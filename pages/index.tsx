import { useState, useEffect } from "react";
import ClipboardImage from "../components/clipboard-image";
import EventEditor from "../components/event-editor";
import AvailabilityEditor from "../components/availability-editor";
import DateRangeSelector from "../components/date-range-selector";
import { extractTextFromImage } from "../lib/ocr";
import {
  parseEvents,
  calculateAvailability,
  DayAvailability,
} from "../utils/availability";
import { add, format, startOfToday } from "date-fns";

export default function Home() {
  const [eventText, setEventText] = useState("");
  const [avail, setAvail] = useState<DayAvailability[]>([]);
  const [workStart, setWorkStart] = useState("09:30");
  const [workEnd, setWorkEnd] = useState("17:30");
  const [excludeWeekends, setExcludeWeekends] = useState(true);

  // Default start date to today and end date to 5 working days from today
  const today = startOfToday();
  const defaultEndDate = add(today, { days: 7 });
  const [startDate, setStartDate] = useState(format(today, "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(defaultEndDate, "yyyy-MM-dd"));

  const handlePaste = async (img: Blob) => {
    const txt = await extractTextFromImage(img);
    setEventText(txt);
  };

  // Re-calculate whenever events, work times, date range, or excludeWeekends change
  useEffect(() => {
    const evs = parseEvents(eventText);
    setAvail(
      calculateAvailability(
        evs,
        workStart,
        workEnd,
        startDate,
        endDate,
        excludeWeekends
      )
    );
  }, [eventText, workStart, workEnd, startDate, endDate, excludeWeekends]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Weekly Availability</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <ClipboardImage onPaste={handlePaste} />
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
          <div className="mt-4 flex gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium">Work Start</span>
              <input
                type="time"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring"
              />
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium">Work End</span>
              <input
                type="time"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={excludeWeekends}
                onChange={(e) => setExcludeWeekends(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">
                Exclude Weekends and bank holidays.
              </span>
            </label>
          </div>
        </div>

        <div className="flex-1">
          <EventEditor value={eventText} onChange={setEventText} />
          <AvailabilityEditor data={avail} />
        </div>
      </div>
    </div>
  );
}
