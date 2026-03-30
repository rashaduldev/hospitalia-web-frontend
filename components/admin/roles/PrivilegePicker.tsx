"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Privilege } from "@/types/admin.role.type";
import { cn } from "@/lib/utils";

function prettifyCategory(raw: string) {
  return raw.charAt(0) + raw.slice(1).toLowerCase().replace(/_/g, " ");
}

function groupPrivileges(privileges: Privilege[]): Record<string, Privilege[]> {
  return privileges.reduce(
    (acc, p) => {
      const category = p.name.split("_")[0];
      if (!acc[category]) acc[category] = [];
      acc[category].push(p);
      return acc;
    },
    {} as Record<string, Privilege[]>,
  );
}

interface Props {
  allPrivileges: Privilege[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}

export function PrivilegePicker({ allPrivileges, selectedIds, onChange, disabled }: Props) {
  const groups = groupPrivileges(allPrivileges);
  const selectedSet = new Set(selectedIds);

  // All categories open by default
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(Object.keys(groups).map((k) => [k, true])),
  );

  const toggleCategory = (cat: string) =>
    setOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const toggle = (id: number) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(Array.from(next));
  };

  const toggleAll = (cat: string) => {
    const catIds = groups[cat].map((p) => p.id);
    const allSelected = catIds.every((id) => selectedSet.has(id));
    const next = new Set(selectedSet);
    if (allSelected) {
      catIds.forEach((id) => next.delete(id));
    } else {
      catIds.forEach((id) => next.add(id));
    }
    onChange(Array.from(next));
  };

  if (allPrivileges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No privileges available.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(groups).map(([cat, privs]) => {
        const catIds = privs.map((p) => p.id);
        const allChecked = catIds.every((id) => selectedSet.has(id));
        const someChecked = catIds.some((id) => selectedSet.has(id));
        const isOpen = open[cat] ?? true;

        return (
          <div key={cat} className="border border-border rounded-lg overflow-hidden">
            {/* Category header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 cursor-pointer select-none">
              {/* Select-all checkbox */}
              <input
                type="checkbox"
                disabled={disabled}
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = someChecked && !allChecked;
                }}
                onChange={() => !disabled && toggleAll(cat)}
                className="h-3.5 w-3.5 rounded accent-primary cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
              {/* Toggle open */}
              <button
                type="button"
                className="flex items-center gap-2 flex-1 text-left"
                onClick={() => toggleCategory(cat)}
              >
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {prettifyCategory(cat)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {catIds.filter((id) => selectedSet.has(id)).length}/{catIds.length}
                </span>
                <span className="ml-auto text-muted-foreground">
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>
            </div>

            {/* Privilege rows */}
            {isOpen && (
              <div className="divide-y divide-border/60">
                {privs.map((p) => {
                  const checked = selectedSet.has(p.id);
                  return (
                    <label
                      key={p.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors",
                        disabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-muted/30",
                        checked && "bg-primary/5",
                      )}
                    >
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={checked}
                        onChange={() => !disabled && toggle(p.id)}
                        className="h-3.5 w-3.5 rounded accent-primary cursor-pointer shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-foreground">
                          {p.name}
                        </span>
                        {p.descName && (
                          <span className="text-[11px] text-muted-foreground ml-2">
                            — {p.descName}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
