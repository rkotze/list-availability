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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onPaste(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
      {preview ? (
        <img
          src={preview}
          alt="uploaded screenshot"
          className="mx-auto max-h-64 object-contain"
        />
      ) : (
        <p className="text-gray-500">
          Paste your calendar screenshot (Ctrl+V) or upload a file
        </p>
      )}
      <div className="mt-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring"
        >
          Select File
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
