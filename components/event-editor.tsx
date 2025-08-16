import React from "react";

interface Props {
  value: string;
  onChange: (txt: string) => void;
}

export default function EventEditor({ value, onChange }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">Extracted Events</h2>
      <textarea
        className="w-full h-40 p-2 border rounded-md font-mono focus:outline-none focus:ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
