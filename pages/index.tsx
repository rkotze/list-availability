import { useState, useEffect } from "react";
import ClipboardImage from "../components/clipboard-image";
import EventEditor from "../components/event-editor";
import AvailabilityEditor from "../components/availability-editor";
import { extractTextFromImage } from "../lib/ocr";
import {
  parseEvents,
  calculateAvailability,
  DayAvailability,
} from "../utils/availability";

export default function Home() {
  const [eventText, setEventText] = useState("");
  const [avail, setAvail] = useState<DayAvailability[]>([]);
  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("17:00");

  const handlePaste = async (img: Blob) => {
    const txt = await extractTextFromImage(img);
    setEventText(txt);
  };

  // Re-calculate whenever events or work times change
  useEffect(() => {
    const evs = parseEvents(eventText);
    setAvail(calculateAvailability(evs, workStart, workEnd));
  }, [eventText, workStart, workEnd]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Weekly Availability</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <ClipboardImage onPaste={handlePaste} />
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
        </div>

        <div className="flex-1">
          <EventEditor value={eventText} onChange={setEventText} />
          <AvailabilityEditor data={avail} />
        </div>
      </div>
    </div>
  );
}
