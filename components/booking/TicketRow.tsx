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
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-sm text-gray-400">
          ₹{price} per person
        </p>
      </div>

      <div className="flex items-center border border-[#ff016e] rounded-lg overflow-hidden">
        <button
          onClick={() => onChange(Math.max(0, count - 1))}
          className="px-3 py-1 text-[#ff016e]"
        >
          −
        </button>

        <span className="px-4 text-white">{count}</span>

        <button
          onClick={() => onChange(count + 1)}
          className="px-3 py-1 text-[#ff016e]"
        >
          +
        </button>
      </div>
    </div>
  );
}
