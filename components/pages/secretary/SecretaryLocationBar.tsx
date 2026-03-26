"use client";

import { MapPin } from "lucide-react";
import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";

export function SecretaryLocationBar() {
  const ctx = useSecretaryLocation();
  if (!ctx) return null;
  const { locations, selectedLocationId, setSelectedLocationId } = ctx;

  if (locations.length === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/15 rounded-xl">
      <div className="flex items-center gap-1.5 text-primary shrink-0">
        <MapPin className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">Location</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {locations.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => setSelectedLocationId(loc.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedLocationId === loc.id
                ? "bg-primary text-white"
                : "bg-background border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}
          >
            {loc.locationName}
            {loc.city ? ` — ${loc.city}` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
