interface TicketRowProps {
  title: string;
  price: number;
  count: number;
  onChange: (value: number) => void;
}

export default function TicketRow({
  title,
  price,
  count,
  onChange,
}: TicketRowProps) {
  return (
    <div className="flex items-center justify-between py-4 px-4 bg-slate-800 rounded-xl mb-3">
      <div className="flex-1">
        <p className="font-semibold text-white text-base">{title}</p>
        <p className="text-sm text-slate-300 mt-0.5">
          ₹{price} per person
        </p>
      </div>

      <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1">
        <button
          onClick={() => onChange(Math.max(0, count - 1))}
          className="w-12 h-12 flex items-center justify-center text-lg font-bold text-white bg-[#ff016e] hover:bg-[#e6015f] active:scale-95 transition-all rounded-lg"
          aria-label="Decrease count"
        >
          −
        </button>

        <span className="w-12 text-center text-white font-bold text-lg">{count}</span>

        <button
          onClick={() => onChange(count + 1)}
          className="w-12 h-12 flex items-center justify-center text-lg font-bold text-white bg-[#ff016e] hover:bg-[#e6015f] active:scale-95 transition-all rounded-lg"
          aria-label="Increase count"
        >
          +
        </button>
      </div>
    </div>
  );
}
