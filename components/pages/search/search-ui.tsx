"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import AppButton from "@/components/common/AppButton";

interface Props {
  initialData: any[];
  keyword: string;
  city: string;
  type: string;
}

export default function SearchUI({
  initialData,
  keyword,
  city,
  type,
}: Props) {
  const router = useRouter();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      searchKeyword: keyword,
      city,
      type,
    },
  });

  const onSubmit = (data: any) => {
    router.push(
      `/search?keyword=${data.searchKeyword}&city=${data.city}&type=${data.type}`
    );
  };

  const isDoctor = type === "plus";

  return (
    <div className="bg-muted min-h-screen py-10">
      <div className="max-w-4xl mx-auto">

        {/* Top Search Card */}
        <div className="bg-background rounded-md p-6 shadow-sm">
          <Typography as="h2" weight="semiBold">
            Get Appointment
          </Typography>
          <Typography size="sm" className="text-muted-foreground mb-4">
            Nice to see you again!
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Radio */}
            <RadioGroup
              defaultValue={type}
              className="flex gap-6 mb-4"
              onValueChange={(value) => setValue("type", value)}
            >
              <FieldLabel htmlFor="doctor">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Doctor</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="plus" id="doctor" />
                </Field>
              </FieldLabel>

              <FieldLabel htmlFor="hospital">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Hospital</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="pro" id="hospital" />
                </Field>
              </FieldLabel>
            </RadioGroup>

            {/* City */}
            <div className="mb-4">
              <Label>Select City *</Label>
              <Select onValueChange={(value) => setValue("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="dhaka">Dhaka</SelectItem>
                    <SelectItem value="chittagong">Chittagong</SelectItem>
                    <SelectItem value="khulna">Khulna</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="mb-4">
              <Label>Search Here *</Label>
              <Input {...register("searchKeyword")} />
            </div>

            <div className="flex justify-center">
              <AppButton type="submit" variant="secondary">
                Search
              </AppButton>
            </div>
          </form>
        </div>

        {/* Result Section */}
        <div className="bg-background rounded-md p-6 mt-8 shadow-sm">
          <Typography as="h3" weight="semiBold" className="mb-4">
            {initialData?.length || 0}{" "}
            {isDoctor ? "Doctors" : "Hospitals"} Found
          </Typography>

          <div className="space-y-4">
            {initialData?.map((item: any, index: number) => (
              <div key={index} className="border-b pb-3">
                <Typography weight="semiBold">
                  {isDoctor ? item.doctorName : item.hospitalName}
                </Typography>
                <Typography size="sm" className="text-muted-foreground">
                  {item.speciality || item.address}
                </Typography>
              </div>
            ))}
          </div>

          {/* Pagination UI (Static design like screenshot) */}
          <div className="flex justify-between items-center mt-6 text-sm text-muted-foreground">
            <span>Showing 1-10 of 100 products</span>

            <div className="flex gap-3 items-center">
              <span>&lt; Previous</span>
              <span className="px-2 py-1 border rounded">1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>...</span>
              <span>10</span>
              <span>Next &gt;</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}