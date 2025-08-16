import React, { useEffect, useState } from "react";

interface Props {
  onPaste: (blob: Blob) => void;
}

export default function ClipboardImage({ onPaste }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image")) {
          const blob = item.getAsFile();
          if (blob) {
            setPreview(URL.createObjectURL(blob));
            onPaste(blob);
          }
        }
      }
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [onPaste]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
      {preview ? (
        <img
          src={preview}
          alt="pasted screenshot"
          className="mx-auto max-h-64 object-contain"
        />
      ) : (
        <p className="text-gray-500">Paste your calendar screenshot (Ctrl+V)</p>
      )}
    </div>
  );
}
