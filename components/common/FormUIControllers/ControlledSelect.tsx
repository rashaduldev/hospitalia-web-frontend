import { FC } from "react";
import { Controller, Control } from "react-hook-form";
import { Label } from "@/components/ui/label"; // Ba FieldLabel
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ControlledSelectProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder: string;
  options: { label: string; value: string | number }[];
}

export const ControlledSelect: FC<ControlledSelectProps> = ({ 
  name, 
  label, 
  control, 
  placeholder, 
  options 
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <Label>{label}</Label>
          <Select
            onValueChange={(value) => {
              const numValue = Number(value);
              field.onChange(isNaN(numValue) ? value : numValue);
            }} 
            value={field.value?.toString()}
          >
            <SelectTrigger className={`w-full ${fieldState.error ? "border-destructive" : ""}`}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
};