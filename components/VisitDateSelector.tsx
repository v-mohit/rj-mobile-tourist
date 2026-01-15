'use client';

import { useState } from 'react';

interface VisitDateSelectorProps {
  onChange: (date: string) => void;
}

export default function VisitDateSelector({ onChange }: VisitDateSelectorProps) {
  const today = new Date().toISOString().split('T')[0];
  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  })();

  const [date, setDate] = useState(today);

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Visit Date
      </label>

      <input
        type="date"
        value={date}
        min={today}
        max={maxDate}
        onChange={(e) => {
          setDate(e.target.value);
          onChange(e.target.value);
        }}
        className="w-full border rounded-lg px-3 py-2 
                   border-[#ff016e] 
                   focus:outline-none 
                   focus:ring-2 
                   focus:ring-[#ff016e]"
      />

      <p className="text-xs text-gray-500 mt-1">
        You can book up to 30 days in advance
      </p>
    </div>
  );
}
