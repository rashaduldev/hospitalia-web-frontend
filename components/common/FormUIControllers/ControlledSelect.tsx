import { FC } from "react";
import { Controller, Control } from "react-hook-form";
import { Label } from "@/components/ui/label"; // Ba FieldLabel
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/Typography";

type OptionType ={
  label: string;
  value: string;
  [key: string]: any;
}
type ControlledSelectProps ={
  name: string;
  label: string;
  control: Control<any>;
  placeholder: string;
  options: OptionType[];
  className?: string;
  renderOption?: (opt: OptionType) => React.ReactNode;
}

export const ControlledSelect: FC<ControlledSelectProps> = ({
  name,
  label,
  control,
  placeholder,
  renderOption,
  options,
  className,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          {label && <Label>{label}</Label>}

          <Select value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger
              className={cn(
                "w-full border rounded-lg",
                className,
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {renderOption ? renderOption(opt) : opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && (
            <Typography size="xs" color="destructive">
              {fieldState.error.message}
            </Typography>
          )}
        </div>
      )}
    />
  );
};
