import { parseEvents } from "../availability";
import { format } from "date-fns";

describe("parseEvents", () => {
  it("parses events with explicit time ranges", () => {
    const text = `
      Monday 18 August
      Role play interview - Technical discussion 13:30 - 14:15
      Interview with Lendable 15:00 - 15:30
    `;
    const events = parseEvents(text);

    expect(events).toHaveLength(2);
    expect(format(events[0].start, "HH:mm")).toBe("13:30");
    expect(format(events[0].end, "HH:mm")).toBe("14:15");
    expect(format(events[1].start, "HH:mm")).toBe("15:00");
    expect(format(events[1].end, "HH:mm")).toBe("15:30");
  });

  it("parses events with durations like 30m or 1h", () => {
    const text = `
      Friday 22 August
      Tom <> Richard: interview prep 11:00
      30m
    `;
    const events = parseEvents(text);

    expect(events).toHaveLength(1);
    expect(format(events[0].start, "HH:mm")).toBe("11:00");
    expect(format(events[0].end, "HH:mm")).toBe("11:30");
  });

  it("handles mixed formats", () => {
    const text = `
      Tuesday 19 August
      Interview - Principal Engineer - Collinson 15:00 - 15:30
      Friday 22 August
      Tom <> Richard: interview prep 11:00
      30m
    `;
    const events = parseEvents(text);

    expect(events).toHaveLength(2);
    expect(format(events[0].start, "HH:mm")).toBe("15:00");
    expect(format(events[0].end, "HH:mm")).toBe("15:30");
    expect(format(events[1].start, "HH:mm")).toBe("11:00");
    expect(format(events[1].end, "HH:mm")).toBe("11:30");
  });

  it("handles days with no events", () => {
    const text = `
      Sunday 24 August
      No event
    `;
    const events = parseEvents(text);

    expect(events).toHaveLength(0);
  });
});
