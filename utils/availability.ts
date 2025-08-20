import {
  parse,
  format,
  eachDayOfInterval,
  startOfDay,
  add,
  isWithinInterval,
  isWeekend,
} from "date-fns";

const monthMap: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

export type EventSlot = { start: Date; end: Date };
export type DayAvailability = { date: Date; slots: EventSlot[] };

export function parseEvents(text: string): EventSlot[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let currentDate: Date | null = null;
  const events: EventSlot[] = [];

  for (const line of lines) {
    const dateMatch = line.match(/^([A-Za-z]+)\s+(\d{1,2})\s+([A-Za-z]+)$/);
    if (dateMatch) {
      const [, , dayStr, monthStr] = dateMatch;
      const day = parseInt(dayStr, 10);
      const monthIndex = monthMap[monthStr.toLowerCase()] ?? 0;
      const year = new Date().getFullYear();
      currentDate = new Date(year, monthIndex, day);
      continue;
    }

    const timeMatch = line.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    if (timeMatch && currentDate) {
      const [, startStr, endStr] = timeMatch;
      const start = parse(startStr, "HH:mm", currentDate);
      const end = parse(endStr, "HH:mm", currentDate);
      events.push({ start, end });
    }
  }

  return events;
}

function isBankHoliday(date: Date): boolean {
  const holidays = [
    "2025-01-01",
    "2025-04-10", // Easter Monday
    "2025-05-05", // Early May Bank Holiday
    "2025-05-26", // Spring Bank Holiday
    "2025-08-25", // Summer Bank Holiday
    "2025-12-25",
    "2025-12-26",
  ];
  return holidays.includes(format(date, "yyyy-MM-dd"));
}

export function calculateAvailability(
  events: EventSlot[],
  workStart: string,
  workEnd: string,
  startDate: string,
  endDate: string,
  excludeWeekends: boolean // New parameter
): DayAvailability[] {
  const start = parse(startDate, "yyyy-MM-dd", new Date());
  const end = parse(endDate, "yyyy-MM-dd", new Date());

  // Group events by date (YYYY-MM-DD)
  const grouped: Record<string, EventSlot[]> = {};
  events.forEach((e) => {
    const key = e.start.toISOString().slice(0, 10);
    grouped[key] = grouped[key] || [];
    grouped[key].push(e);
  });

  // Generate availability for each day in the range
  return eachDayOfInterval({ start, end })
    .filter((date) => {
      // If excludeWeekends is true, also exclude weekends and UK bank holidays
      if (excludeWeekends && (isWeekend(date) || isBankHoliday(date))) {
        return false;
      }
      return true;
    })
    .map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayEvents = grouped[dateStr] || [];
      const dayStart = parse(workStart, "HH:mm", date);
      const dayEnd = parse(workEnd, "HH:mm", date);

      // Sort & merge overlaps
      const sorted = dayEvents
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .reduce<EventSlot[]>((acc, cur) => {
          if (!acc.length || cur.start > acc.at(-1)!.end) {
            acc.push({ ...cur });
          } else {
            acc[acc.length - 1].end = new Date(
              Math.max(acc.at(-1)!.end.getTime(), cur.end.getTime())
            );
          }
          return acc;
        }, []);

      // Slice free slots
      const slots: EventSlot[] = [];
      let cursor = dayStart;
      for (const busy of sorted) {
        if (busy.start > cursor) {
          slots.push({ start: cursor, end: busy.start });
        }
        cursor = busy.end > cursor ? busy.end : cursor;
      }
      if (cursor < dayEnd) {
        slots.push({ start: cursor, end: dayEnd });
      }

      return { date, slots };
    });
}
