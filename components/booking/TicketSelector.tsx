'use client';

import { useState } from 'react';
import TicketRow from './TicketRow';

interface TicketSelectorProps {
  placeName: string;
  strapiPlaceId: number;
  bookable: boolean;
}


export default function TicketSelector({ placeName }: TicketSelectorProps) {
  const [indian, setIndian] = useState(1);
  const [foreigner, setForeigner] = useState(0);

  const total = indian * 50 + foreigner * 200;

  return (
    <section className="max-w-md mx-auto px-4 py-6 bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-[#ff016e] mb-1">
        {placeName.toUpperCase()}
      </h1>

      <h2 className="text-lg font-semibold text-white mb-4">
        Member Details
      </h2>

      <TicketRow
        title="Indian Citizen"
        price={50}
        count={indian}
        onChange={setIndian}
      />

      <TicketRow
        title="Foreign Citizen"
        price={200}
        count={foreigner}
        onChange={setForeigner}
      />

      <div className="border-t border-gray-700 mt-6 pt-4 flex justify-between">
        <span className="text-gray-300">Total Amount</span>
        <span className="text-xl font-bold text-[#ff016e]">
          ₹ {total}
        </span>
      </div>

      <button
        disabled={total === 0}
        className="mt-6 w-full bg-[#ff016e] text-white py-3 rounded-lg font-semibold disabled:opacity-40"
        onClick={() => {
          sessionStorage.setItem(
            'booking',
            JSON.stringify({ indian, foreigner, total })
          );
          window.location.href = '/verify';
        }}
      >
        NEXT
      </button>
    </section>
  );
}
