"use client";

import { useState } from "react";

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: Array<{ id: string; name: string }>;
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectedNames = options
    .filter((o) => selected.includes(o.id))
    .map((o) => o.name)
    .join(", ");

  return (
    <div className="flex items-start gap-3">
      <div className="w-24 font-semibold pt-2">{label}</div>
      <div className="flex-1 relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full border rounded px-3 py-2 text-left"
        >
          {selectedNames || `Select ${label.toLowerCase()}...`}
        </button>
        {open && (
          <div className="absolute z-10 w-full border rounded mt-1 bg-white dark:bg-neutral-900 max-h-48 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-500 text-center">
                No {label.toLowerCase()} available.
              </div>
            ) : (
              options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.id)}
                    onChange={() => toggle(option.id)}
                  />
                  <span>{option.name}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
