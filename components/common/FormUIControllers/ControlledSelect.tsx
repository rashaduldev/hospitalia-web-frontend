import { FC } from "react";
import { Controller, Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/Typography";

type OptionType = {
  label: string;
  value: string | number;
  [key: string]: any;
};
type ControlledSelectProps = {
  name: string;
  required?: string;
  label?: string;
  control: Control<any>;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: OptionType[];
  className?: string;
  disabled?: boolean;
  renderOption?: (opt: OptionType) => React.ReactNode;
};

export const ControlledSelect: FC<ControlledSelectProps> = ({
  name,
  label,
  required,
  control,
  placeholder,
  renderOption,
  options,
  onChange,
  className,
  disabled,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-0">
          <div className="flex items-center gap-1">
            {label && (
              <Label className="mb-1">
                {label}
                {required && (
                  <Typography size="sm" color="destructive">
                    {required}
                  </Typography>
                )}
              </Label>
            )}
          </div>

          <Select
            value={field.value || ""}
            disabled={disabled}
            onValueChange={(value) => {
              field.onChange(value);
              if (onChange) onChange(value);
            }}
          >
            <SelectTrigger
              className={cn("w-full border rounded-lg", className)}
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
            <Typography
              size="xs"
              color="destructive"
              className="mt-1 text-left"
            >
              {fieldState.error.message}
            </Typography>
          )}
        </div>
      )}
    />
  );
};
