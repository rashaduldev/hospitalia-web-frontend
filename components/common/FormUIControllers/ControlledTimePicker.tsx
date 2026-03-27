import { Controller, Control } from "react-hook-form";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse a 24-hour "HH:mm" string into display parts. */
function parseTime(value: string): { hour: string; minute: string; period: "AM" | "PM" } {
  if (!value) return { hour: "", minute: "", period: "AM" };
  const [hStr, mStr] = value.split(":");
  const h24 = Number(hStr);
  const period: "AM" | "PM" = h24 >= 12 ? "PM" : "AM";
  const hour12 = h24 % 12 || 12;
  return { hour: String(hour12), minute: mStr ?? "00", period };
}

/** Convert 12-hour parts back to "HH:mm" 24-hour format. */
function buildTime(hour: string, minute: string, period: "AM" | "PM"): string {
  if (!hour || !minute) return "";
  const h = Number(hour);
  let h24: number;
  if (period === "AM") h24 = h === 12 ? 0 : h;
  else h24 = h === 12 ? 12 : h + 12;
  return `${String(h24).padStart(2, "0")}:${minute}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

// ── Inner picker ──────────────────────────────────────────────────────────────

function TimePicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(parsed.period);

  // Sync local state when form resets or external value changes
  useEffect(() => {
    const p = parseTime(value);
    setHour(p.hour);
    setMinute(p.minute);
    setPeriod(p.period);
  }, [value]);

  const handleHour = (h: string) => {
    setHour(h);
    if (h && minute) onChange(buildTime(h, minute, period));
  };

  const handleMinute = (m: string) => {
    setMinute(m);
    if (hour && m) onChange(buildTime(hour, m, period));
  };

  const handlePeriod = (p: "AM" | "PM") => {
    setPeriod(p);
    if (hour && minute) onChange(buildTime(hour, minute, p));
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Hour */}
      <Select value={hour} disabled={disabled} onValueChange={handleHour}>
        <SelectTrigger className="w-20 h-9 text-sm">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground font-medium text-sm">:</span>

      {/* Minute */}
      <Select value={minute} disabled={disabled} onValueChange={handleMinute}>
        <SelectTrigger className="w-20 h-9 text-sm">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* AM / PM toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        {(["AM", "PM"] as const).map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => handlePeriod(p)}
            className={cn(
              "px-2.5 h-9 text-xs font-semibold transition-colors",
              period === p
                ? "bg-primary text-white"
                : "bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Controlled wrapper ────────────────────────────────────────────────────────

type Props = {
  name: string;
  control: Control<any>;
  label?: string;
  disabled?: boolean;
};

export function ControlledTimePicker({ name, control, label, disabled }: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          {label && <Label className="mb-1">{label}</Label>}
          <TimePicker value={field.value ?? ""} onChange={field.onChange} disabled={disabled} />
          {fieldState.error && (
            <Typography size="xs" color="destructive" className="mt-1">
              {fieldState.error.message}
            </Typography>
          )}
        </div>
      )}
    />
  );
}
