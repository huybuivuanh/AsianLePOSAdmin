"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addButtonClass } from "@/components/layout/RowParts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchField } from "@/components/ui/search-field";
import { useOptionStore } from "@/stores/useOptionStore";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { alertDialog } from "@/stores/useModalStore";
import { setOptionGroupOptions } from "@/lib/linked-writes";

export function AddGroupOptionsForm({ group }: { group: OptionGroup }) {
  const { options } = useOptionStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(group.optionIds ?? []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await setOptionGroupOptions(group.id!, selected);
      setOpen(false);
    } catch (err) {
      console.error("Failed to save options for group:", err);
      await alertDialog("Couldn't save options for group. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (next) {
            setSelected(group.optionIds ?? []);
            setSearchTerm("");
          }
          setOpen(next);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className={addButtonClass}>
            + Add options
          </Button>
        </DialogTrigger>
        <DialogContent className="mx-auto flex !max-w-[calc(100vw-1rem)] w-[calc(100vw-1rem)] max-h-[90dvh] !flex-col gap-4 items-stretch sm:w-[80vw] sm:!max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Add Options to Group</DialogTitle>
            <DialogDescription>
              Select the options you want to include in <b>{group.name}</b>.
            </DialogDescription>
          </DialogHeader>

          {/* Search bar */}
          <div className="mb-0 shrink-0">
            <SearchField
              placeholder="Search options…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search options"
            />
          </div>

          {/* Scrollable options list */}
          <div className="max-h-[min(52dvh,24rem)] space-y-2 overflow-y-auto sm:max-h-[calc(80vh-220px)]">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                >
                  <Checkbox
                    checked={selected.includes(opt.id!)}
                    onCheckedChange={() => toggleSelect(opt.id!)}
                    disabled={loading}
                  />
                  <span>
                    {opt.name} – ${opt.price.toFixed(2)}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                No options match your search
              </p>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Selection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
