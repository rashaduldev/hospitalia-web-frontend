import { ReactNode } from "react";
import { Typography } from "../ui/Typography";

type DetailItemProps = {
  label: string;
  value?: string;
  icon?: ReactNode;
}

export const DetailItem = ({ label, value, icon }: DetailItemProps) => (
  <div className="flex items-start gap-2">
    {icon && <div className="mt-1 text-primary">{icon}</div>}

    <div className="flex flex-col gap-1">
      <Typography
        size="sm"
        weight="medium"
        color="primary"
        className="uppercase tracking-wider"
      >
        {label}
      </Typography>

      <Typography color="foreground" size="xs">
        {value || "N/A"}
      </Typography>
    </div>
  </div>
);