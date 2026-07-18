import type { OrderItem } from "@/types";

export function OrderItemBlock({ item }: { item: OrderItem }) {
  return (
    <li className="mb-2.5 rounded-2xl border border-stone-200/90 bg-white px-3 py-3.5 shadow-sm shadow-stone-200/40">
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex-1 text-lg font-semibold text-stone-900">
          <span className="font-bold text-stone-600">{item.quantity}</span>
          <span className="text-stone-400"> × </span>
          {item.name}
        </span>
        <span className="text-lg font-bold text-stone-900">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>

      {item.options != null && item.options.length > 0 ? (
        <div className="mt-2 border-t border-stone-100 pt-2">
          {item.options.map((o, j) => (
            <p key={j} className="text-[15px] leading-5 text-stone-600">
              <span className="text-stone-400">· </span>
              {o.quantity > 1 ? `${o.quantity}× ` : ""}
              {o.name}
              {o.price > 0 ? `  ·  $${(o.price * o.quantity).toFixed(2)}` : ""}
            </p>
          ))}
        </div>
      ) : null}

      {item.extras != null && item.extras.length > 0 ? (
        <div className="mt-1.5">
          {item.extras.map((ex, j) => (
            <p key={j} className="text-[15px] leading-5 text-stone-600">
              <span className="text-stone-400">· </span>
              Add: {ex.description}
              <span className="text-stone-500">
                {ex.price > 0 ? ` · $${ex.price.toFixed(2)}` : ""}
              </span>
            </p>
          ))}
        </div>
      ) : null}

      {item.changes != null && item.changes.length > 0 ? (
        <div className="mt-1.5">
          {item.changes.map((c, j) => (
            <p key={j} className="text-[15px] leading-5 text-stone-600">
              <span className="text-stone-400">· </span>
              {c.from} → {c.to}
              <span className="text-stone-500">
                {c.price > 0 ? ` · $${c.price.toFixed(2)}` : ""}
              </span>
            </p>
          ))}
        </div>
      ) : null}

      {item.instructions != null && item.instructions.trim() !== "" ? (
        <div className="mt-2.5 rounded-lg border border-stone-100 bg-stone-50 px-3 py-2">
          <p className="text-[15px] italic leading-5 text-stone-600">
            &ldquo;{item.instructions}&rdquo;
          </p>
        </div>
      ) : null}
    </li>
  );
}
