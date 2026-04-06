"use client";

import { Button } from "@/components/ui/button";

export default function NumberStepper({
  value,
  setValue,
  min = 0,
  max = 10,
  disabled = false,
}: {
  value: number;
  setValue: (val: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const increment = () => setValue(Math.min(max, value + 1));
  const decrement = () => setValue(Math.max(min, value - 1));

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={decrement}
        disabled={disabled || value <= min}
      >
        -
      </Button>
      <span className="w-10 text-center">{value}</span>
      <Button
        type="button"
        variant="outline"
        onClick={increment}
        disabled={disabled || value >= max}
      >
        +
      </Button>
    </div>
  );
}
