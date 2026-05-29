import type { OrderItem } from "@/types";

export function OrderItemBlock({ item }: { item: OrderItem }) {
  return (
    <li className="rounded-lg border border-white/80 bg-white px-3 py-2.5 text-sm shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="font-medium">{item.quantity}</span>
          {" × "}
          {item.name}
        </span>
        <span className="shrink-0 tabular-nums">${item.price.toFixed(2)}</span>
      </div>
      {item.options != null && item.options.length > 0 ? (
        <ul className="mt-1.5 space-y-0.5 border-t border-border/40 pt-1.5 text-xs text-muted-foreground">
          {item.options.map((o, j) => (
            <li key={j}>
              •{o.quantity > 1 ? ` ${o.quantity}×` : ""} {o.name}{" "}
              <span className="tabular-nums">
                {o.price > 0 ? ` $${o.price.toFixed(2)}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.changes != null && item.changes.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {item.changes.map((c, j) => (
            <li key={j}>
              <span className="tabular-nums">•</span> Change: {c.from} → {c.to}{" "}
              <span className="tabular-nums">
                {c.price > 0 ? ` $${c.price.toFixed(2)}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.extras != null && item.extras.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {item.extras.map((ex, j) => (
            <li key={j}>
              <span className="tabular-nums">•</span>Add Extra: {ex.description}{" "}
              <span className="tabular-nums">
                {ex.price > 0 ? ` $${ex.price.toFixed(2)}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.instructions != null && item.instructions.trim() !== "" ? (
        <p className="mt-1.5 text-xs italic text-muted-foreground">
          <span className="tabular-nums">•</span> Note: {item.instructions}
        </p>
      ) : null}
    </li>
  );
}
