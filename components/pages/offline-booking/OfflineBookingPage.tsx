"use client";

import { useState, useEffect } from "react";
import { useForm, useController, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  CalendarCheck2,
  Loader2,
  Clock,
  MapPin,
  Stethoscope,
  User,
  Mail,
  Phone,
  Banknote,
  ArrowLeft,
  CheckCircle2,
  Search,
  UserCheck,
  UserX,
  AlertCircle,
  X,
} from "lucide-react";
import {
  getCountryCallingCode,
  getCountries,
  parsePhoneNumber,
  type Country,
} from "react-phone-number-input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/ui/phone-input";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  offlineBookingSchema,
  OfflineBookingFormValues,
} from "@/schema/offline.booking.schema";
import { getDoctorAvailabilityByDoctorId } from "@/actions/doctor/availability";
import { getAvailableSlots } from "@/actions/doctor/slot";
import { getAppointmentsByDate } from "@/actions/doctor/appointment";
import { getDoctorLocations } from "@/actions/doctor/location";
import { getDoctorUnAvailability } from "@/actions/doctor/unavailability";
import { searchPatientByPhone } from "@/actions/patient/search.actions";
import { bookStaffAppointment } from "@/actions/doctor/booking";
import { toast } from "sonner";
import { DoctorLocation } from "@/types/doctor.location.type";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { cn } from "@/lib/utils";

// Pre-computed country options — same as ControlledPhoneInput
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryOptions = getCountries().map((country) => ({
  value: country,
  label: regionNames.of(country) || country,
}));

const SectionHeading = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm font-semibold text-foreground">{label}</span>
  </div>
);

// ── Local split-phone field ────────────────────────────────────────────────────
// Uses local state for the display value so typing never clears the input.
// A useEffect syncs inward when an external setValue() sets field.value
// (e.g. patient search pre-fill), so both paths work correctly.

interface PatientSplitFieldProps {
  field: any;
  setValue: any;
  error?: string;
}

const PatientSplitField = ({ field, setValue, error }: PatientSplitFieldProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>("SN");
  const [localNumber, setLocalNumber] = useState("");

  // Sync inward when field.value is set programmatically from outside
  useEffect(() => {
    if (!field.value) {
      setLocalNumber("");
      return;
    }
    const parsed = parsePhoneNumber(field.value);
    if (parsed?.nationalNumber) {
      setLocalNumber(parsed.nationalNumber);
      if (parsed.country) setSelectedCountry(parsed.country as Country);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const countryCode = `+${getCountryCallingCode(selectedCountry)}`;

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    const code = `+${getCountryCallingCode(country)}`;
    setValue("countryCode", code);
    field.onChange(localNumber ? `${code}${localNumber}` : "");
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setLocalNumber(digits);
    setValue("countryCode", countryCode);
    field.onChange(digits ? `${countryCode}${digits}` : "");
  };

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1">
        Phone <span className="text-destructive">*</span>
      </Label>
      <div className="flex">
        <CountrySelect
          value={selectedCountry}
          options={countryOptions}
          onChange={handleCountryChange}
        />
        <span className="flex items-center px-3 text-sm font-medium bg-muted text-muted-foreground border border-input border-l-0 select-none whitespace-nowrap">
          {countryCode}
        </span>
        <Input
          type="tel"
          inputMode="numeric"
          value={localNumber}
          onChange={handleNumberChange}
          onBlur={field.onBlur}
          placeholder="Enter phone number"
          className={`rounded-s-none flex-1 border-l-0 ${error ? "border-destructive" : ""}`}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

const PatientPhoneInput = ({
  control,
  setValue,
  error,
}: {
  control: any;
  setValue: any;
  error?: string;
}) => (
  <Controller
    name="patientPhone"
    control={control}
    render={({ field }) => (
      <PatientSplitField field={field} setValue={setValue} error={error} />
    )}
  />
);

interface OfflineBookingPageProps {
  doctorId: number;
  bookedByUserId: number;
  bookingSource: "DOCTOR" | "SECRETARY";
  doctorName: string;
  doctorDesignation?: string;
  lang: string;
  defaultLocationId?: number;
  backHref: string;
}

export function OfflineBookingPage({
  doctorId,
  bookedByUserId,
  bookingSource,
  doctorName,
  doctorDesignation,
  lang,
  defaultLocationId,
  backHref,
}: OfflineBookingPageProps) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<OfflineBookingFormValues | null>(null);
  const [bookedAppointmentId, setBookedAppointmentId] = useState<number | null>(null);
  const [confirmedDetails, setConfirmedDetails] = useState<{
    endTime: string;
    locationName: string;
    appointmentTypeName: string;
    fees: number;
  } | null>(null);
  const queryClient = useQueryClient();

  // Patient search state
  const [searchCountry, setSearchCountry] = useState<Country>("SN");
  const [searchNumber, setSearchNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [patientUserId, setPatientUserId] = useState<number | null>(null);

  const searchCountryCode = `+${getCountryCallingCode(searchCountry)}`;
  const fullSearchPhone = searchNumber
    ? `${searchCountryCode}${searchNumber}`
    : "";

  const buildDefaultValues = () => ({
    patientFirstName: "",
    patientLastName: "",
    patientGender: undefined as "Male" | "Female" | undefined,
    patientAge: undefined as number | undefined,
    patientPhone: "",
    patientEmail: "",
    countryCode: "",
    location: defaultLocationId ? String(defaultLocationId) : "",
    patientType: "new" as const,
    appointmentTypeId: "",
    availableDates: "",
    availableSlots: "",
  });

  const {
    handleSubmit,
    control,
    setValue,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OfflineBookingFormValues>({
    resolver: zodResolver(offlineBookingSchema),
    defaultValues: buildDefaultValues(),
  });

  const selectedLocation = useWatch({ control, name: "location" });
  const selectedDate = useWatch({ control, name: "availableDates" });
  const patientType = useWatch({ control, name: "patientType" });
  const { field: dateField } = useController({ name: "availableDates", control });
  const { field: slotField } = useController({ name: "availableSlots", control });
  const { field: appointmentTypeField } = useController({ name: "appointmentTypeId", control });

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["offline-booking-locations", doctorId],
    queryFn: async () => {
      const res = await getDoctorLocations({ doctorId, lang });
      return (res.payload as DoctorLocation[]) || [];
    },
    enabled: !!doctorId,
  });

  const { data: unavailableDates = [] } = useQuery({
    queryKey: ["offline-booking-unavailability", doctorId],
    queryFn: async () => {
      const res = await getDoctorUnAvailability({ doctorId, lang });
      return ((res.payload as any)?.content as UnavailableDate[]) || [];
    },
    enabled: !!doctorId,
  });

  const locationOptions = (locationsData || []).map((l) => ({
    label: l.locationName,
    value: l.locationId,
  }));

  const { data: locationAvailability, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ["offline-booking-availability", doctorId, selectedLocation],
    queryFn: async () => {
      const res = await getDoctorAvailabilityByDoctorId({
        lang,
        doctorId,
        doctorLocationId: Number(selectedLocation),
      });
      return res.payload || [];
    },
    enabled: !!selectedLocation,
  });

  const { data: slotData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["offline-booking-slots", doctorId, selectedLocation, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      const res = await getAvailableSlots({
        doctorId,
        doctorLocationId: Number(selectedLocation),
        lang,
        requestedDate: format(parseISO(selectedDate), "yyyy-MM-dd"),
      });
      return res.payload || [];
    },
    enabled: Boolean(selectedDate && doctorId && selectedLocation),
  });

  const { data: appointmentsOnDate = [] } = useQuery({
    queryKey: ["offline-booking-appointments-on-date", doctorId, selectedDate],
    queryFn: () =>
      getAppointmentsByDate({
        doctorId,
        date: format(parseISO(selectedDate!), "yyyy-MM-dd"),
        lang,
      }),
    enabled: Boolean(selectedDate && doctorId),
  });

  const selectedLocationData = (locationsData || []).find(
    (l) => l.locationId === Number(selectedLocation)
  );
  const newPatientFee = selectedLocationData?.newPatientFee ?? null;
  const oldPatientFee = selectedLocationData?.oldPatientFee ?? null;
  const feeCurrency = selectedLocationData?.feeCurrency ?? "";
  const appointmentTypes = selectedLocationData?.supportedAppointmentTypes ?? [];

  const formatFee = (fee: number | null) =>
    fee != null ? `${fee.toLocaleString()} ${feeCurrency}`.trim() : "Not set";

  const bookedStartTimes = new Set(
    appointmentsOnDate
      .filter((a: any) => a.appointmentStatus !== "CANCELLED")
      .map((a: any) => a.startTime)
  );

  const isDayAvailable = (date: Date) => {
    if (!locationAvailability?.content) return false;
    const dayName = format(date, "EEEE").toUpperCase();
    return locationAvailability.content.some((item: any) => item.dayOfWeek === dayName);
  };

  const isDateUnavailable = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return unavailableDates.some((item) => item.unavailableDate === dateString);
  };

  const formatTimeTo12H = (time: string) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    return `${h % 12 || 12}:${minute} ${h >= 12 ? "PM" : "AM"}`;
  };

  const categorizeSlots = (slots: any[]) => {
    const groups: Record<string, any[]> = { Morning: [], Afternoon: [], Evening: [] };
    slots?.forEach((slot) => {
      const hour = parseInt(slot.startTime.split(":")[0]);
      const period = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
      groups[period].push(slot);
    });
    return groups;
  };

  const groupedSlots = categorizeSlots(slotData?.slots || []);
  const hasSlots = Object.values(groupedSlots).some((s) => s.length > 0);

  // ── Patient search ──────────────────────────────────────────────────────────
  const handlePatientSearch = async () => {
    if (!fullSearchPhone) return;
    setIsSearching(true);
    setSearchResult(null);
    setSearchNotFound(false);
    setSearchError(null);
    try {
      const res = await searchPatientByPhone({ phoneNumber: fullSearchPhone, lang });
      const result = Array.isArray(res.payload)
        ? res.payload[0] ?? null
        : res.payload ?? null;
      if (res.success && result) {
        setSearchResult(result);
      } else {
        setSearchNotFound(true);
      }
    } catch {
      setSearchError("Something went wrong. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUsePatient = (patient: any) => {
    setValue("patientFirstName", patient.firstName || "");
    setValue("patientLastName", patient.lastName || "");
    if (patient.gender === "Male" || patient.gender === "Female") {
      setValue("patientGender", patient.gender);
    }
    if (patient.email) setValue("patientEmail", patient.email);
    if (patient.age != null) setValue("patientAge", patient.age);
    // Set the phone field to the searched phone
    setValue("patientPhone", fullSearchPhone);
    setValue("countryCode", searchCountryCode);
    setPatientUserId(patient.userId ?? patient.id ?? null);
    setSearchResult(null);
  };

  const handleClearSearch = () => {
    setSearchNumber("");
    setSearchResult(null);
    setSearchNotFound(false);
    setSearchError(null);
    setPatientUserId(null);
  };

  const onSubmit = async (data: OfflineBookingFormValues) => {
    const selectedSlotObj = slotData?.slots?.find(
      (s: any) => s.startTime === data.availableSlots
    );

    if (!selectedSlotObj) {
      toast.error("Selected time slot is no longer available. Please pick another.");
      return;
    }

    const appointmentDate = format(parseISO(data.availableDates), "yyyy-MM-dd");
    const fees = patientType === "new" ? (newPatientFee ?? 0) : (oldPatientFee ?? 0);

    try {
      const res = await bookStaffAppointment({
        lang,
        doctorId,
        appointmentDate,
        dayOfWeek: format(parseISO(data.availableDates), "EEEE").toUpperCase(),
        fees,
        appointmentTypeId: Number(data.appointmentTypeId),
        appointmentSlotDto: {
          locationId: Number(selectedLocation),
          startTime: selectedSlotObj.startTime,
          endTime: selectedSlotObj.endTime,
          slotDuration: selectedSlotObj.slotDuration ?? 15,
        },
        patientName: `${data.patientFirstName} ${data.patientLastName}`,
        patientGender: data.patientGender!,
        patientAge: data.patientAge ?? null,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail || null,
        patientUserId: patientUserId ?? null,
        bookedByUserId,
        bookingSource,
      });

      if (res.success) {
        const appointment = (res as any).data;
        setBookedAppointmentId(appointment?.appointmentId ?? null);
        setConfirmedDetails({
          endTime: selectedSlotObj.endTime,
          locationName: selectedLocationData?.locationName ?? "",
          appointmentTypeName:
            appointmentTypes.find((t) => String(t.id) === data.appointmentTypeId)?.name ?? "",
          fees,
        });
        setSubmittedData(data);
        setSubmitted(true);
      } else {
        const status = res.statusCode;
        if (status === 400) {
          toast.error(res.message || "This slot is no longer available. Please choose a different time.");
        } else if (status === 403) {
          toast.error("You don't have permission to book appointments.");
        } else if (status === 404) {
          toast.error(res.message || "Doctor or location not found. Please refresh and try again.");
        } else if (status === 422) {
          toast.error("Some required fields are missing. Please check the form and try again.");
        } else {
          toast.error(res.message || "Booking failed. Please try again.");
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleBookAnother = () => {
    setSubmitted(false);
    setSubmittedData(null);
    setBookedAppointmentId(null);
    setConfirmedDetails(null);
    setPatientUserId(null);
    setSearchNumber("");
    setSearchResult(null);
    setSearchNotFound(false);
    setSearchError(null);
    reset(buildDefaultValues());
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted && submittedData) {
    const patientFullName = `${submittedData.patientFirstName} ${submittedData.patientLastName}`;
    const patientMeta = [
      submittedData.patientGender,
      submittedData.patientAge != null ? `${submittedData.patientAge} yrs` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    return (
      <div className="py-6 px-4 sm:px-6 max-w-2xl mx-auto space-y-4">

        {/* Hero */}
        <div className="border border-border rounded-xl bg-card shadow-sm px-6 py-8 flex flex-col items-center gap-3 text-center">
          <div className="p-4 bg-secondary/10 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">Appointment Confirmed</h2>
            {bookedAppointmentId && (
              <p className="text-sm text-muted-foreground">Ref #{bookedAppointmentId}</p>
            )}
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/10 text-secondary uppercase tracking-wide">
            {bookingSource === "DOCTOR" ? "Booked by Doctor" : "Booked by Secretary"}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Appointment card */}
          <div className="border border-border rounded-xl bg-card shadow-sm p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Appointment
            </p>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Doctor</p>
                  <p className="text-sm font-semibold text-foreground">{doctorName}</p>
                  {doctorDesignation && (
                    <p className="text-xs text-muted-foreground">{doctorDesignation}</p>
                  )}
                </div>
              </div>
              {confirmedDetails?.locationName && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{confirmedDetails.locationName}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <CalendarCheck2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {format(parseISO(submittedData.availableDates), "EEEE, d MMMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatTimeTo12H(submittedData.availableSlots)}
                    {confirmedDetails?.endTime && (
                      <span className="text-muted-foreground"> – {formatTimeTo12H(confirmedDetails.endTime)}</span>
                    )}
                  </p>
                </div>
              </div>
              {confirmedDetails?.appointmentTypeName && (
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium text-foreground">{confirmedDetails.appointmentTypeName}</p>
                  </div>
                </div>
              )}
              {confirmedDetails?.fees != null && (
                <div className="flex items-start gap-3">
                  <Banknote className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fee</p>
                    <p className="text-sm font-medium text-foreground">
                      {confirmedDetails.fees.toLocaleString()} {feeCurrency}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{submittedData.patientType} patient rate</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Patient card */}
          <div className="border border-border rounded-xl bg-card shadow-sm p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Patient
            </p>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-semibold text-foreground">{patientFullName}</p>
                  {patientMeta && (
                    <p className="text-xs text-muted-foreground">{patientMeta}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{submittedData.patientPhone}</p>
                </div>
              </div>
              {submittedData.patientEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{submittedData.patientEmail}</p>
                  </div>
                </div>
              )}
              {patientUserId && (
                <div className="flex items-start gap-3">
                  <UserCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account</p>
                    <p className="text-xs font-medium text-secondary">Linked to registered account</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleBookAnother}>
            Book Another
          </Button>
          <Button className="flex-1" onClick={() => router.push(backHref)}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div className="py-6 px-4 sm:px-6 space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(backHref)}
          className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-muted transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-foreground leading-none">
            Offline Appointment Booking
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Book an appointment on behalf of a walk-in or phone-in patient
          </p>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Right panel: Patient info + Submit (1/3) ────────────────── */}
          <div className="lg:col-span-1 lg:order-2 space-y-5 lg:sticky lg:top-6 lg:self-start">

            {/* Patient info */}
            <div className="border border-border rounded-xl bg-card shadow-sm p-5">
              <SectionHeading icon={User} label="Patient Information" />

              {/* ── Patient search ── */}
              <div className="mb-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Search existing patient</p>
                <div className="flex gap-2">
                  <div className="flex flex-1 min-w-0">
                    <CountrySelect
                      value={searchCountry}
                      options={countryOptions}
                      onChange={(c) => setSearchCountry(c)}
                    />
                    <span className="flex items-center px-2.5 text-xs font-medium bg-muted text-muted-foreground border border-input border-l-0 select-none whitespace-nowrap">
                      {searchCountryCode}
                    </span>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      value={searchNumber}
                      onChange={(e) => {
                        setSearchNumber(e.target.value.replace(/\D/g, ""));
                        setSearchNotFound(false);
                        setSearchError(null);
                      }}
                      placeholder="Phone number"
                      className="rounded-s-none flex-1 border-l-0 min-w-0"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handlePatientSearch())}
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="shrink-0"
                    disabled={!searchNumber || isSearching}
                    onClick={handlePatientSearch}
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Not found */}
                {searchNotFound && (
                  <div className="flex items-start gap-2.5 px-3 py-2.5 bg-muted/60 border border-border rounded-lg">
                    <UserX className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-foreground">No patient found</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        No account matches this number. Fill in the details manually below.
                      </p>
                    </div>
                  </div>
                )}

                {/* Search error */}
                {searchError && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                    <p className="text-xs text-destructive">{searchError}</p>
                  </div>
                )}

                {/* Search result */}
                {searchResult && (
                  <div className="border border-secondary/40 bg-secondary/5 rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <UserCheck className="w-4 h-4 text-secondary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {searchResult.firstName} {searchResult.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {[searchResult.gender, searchResult.age && `${searchResult.age} yrs`]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSearchResult(null)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={() => handleUsePatient(searchResult)}
                    >
                      Use this patient
                    </Button>
                  </div>
                )}

                {/* Selected patient badge */}
                {patientUserId && !searchResult && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/30 rounded-lg">
                    <UserCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="text-xs font-medium text-secondary flex-1">
                      Existing patient linked
                    </span>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <Separator className="mb-4" />

              <div className="space-y-3">

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="offlineFirstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="offlineFirstName"
                      {...register("patientFirstName")}
                      placeholder="John"
                    />
                    {errors.patientFirstName && (
                      <p className="text-xs text-destructive">{errors.patientFirstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="offlineLastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="offlineLastName"
                      {...register("patientLastName")}
                      placeholder="Doe"
                    />
                    {errors.patientLastName && (
                      <p className="text-xs text-destructive">{errors.patientLastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Gender + Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>
                      Gender <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="patientGender"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.patientGender && (
                      <p className="text-xs text-destructive">{errors.patientGender.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="offlineAge">Age</Label>
                    <Input
                      id="offlineAge"
                      {...register("patientAge", { valueAsNumber: true })}
                      type="number"
                      min={0}
                      max={150}
                      placeholder="45"
                    />
                    {errors.patientAge && (
                      <p className="text-xs text-destructive">{errors.patientAge.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone — full width split input */}
                <PatientPhoneInput
                  control={control}
                  setValue={setValue}
                  error={errors.patientPhone?.message}
                />

                {/* Email — full width */}
                <div className="space-y-1.5">
                  <Label htmlFor="offlineEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="offlineEmail"
                      {...register("patientEmail")}
                      type="email"
                      placeholder="patient@example.com"
                      className="pl-9"
                    />
                  </div>
                  {errors.patientEmail && (
                    <p className="text-xs text-destructive">{errors.patientEmail.message}</p>
                  )}
                </div>

              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full font-semibold h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...
                </>
              ) : (
                "Confirm Offline Booking"
              )}
            </Button>
          </div>

          {/* ── Left panel: Schedule (2/3) ──────────────────────────────── */}
          <div className="lg:col-span-2 lg:order-1">
            <div className="border border-border rounded-xl bg-card shadow-sm divide-y divide-border">

              {/* Doctor info + Location — side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Doctor</p>
                    <p className="text-sm font-semibold text-foreground truncate">{doctorName}</p>
                    {doctorDesignation && (
                      <p className="text-xs text-muted-foreground truncate">{doctorDesignation}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                    Pre-set
                  </span>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">Location</span>
                  </div>
                  <div className="flex-1">
                    {isLoadingLocations ? (
                      <div className="h-9 rounded-lg bg-muted animate-pulse" />
                    ) : (
                      <ControlledSelect
                        name="location"
                        control={control}
                        placeholder="Select location"
                        options={locationOptions}
                        onChange={() => {
                          setValue("availableDates", "");
                          setValue("availableSlots", "");
                          setValue("appointmentTypeId", "");
                          queryClient.removeQueries({
                            queryKey: ["offline-booking-availability"],
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Fees + Appointment type — side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">

                {/* Consultation fees */}
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Consultation Fees
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setValue("patientType", "new")}
                      className={cn(
                        "rounded-lg px-3 py-2 text-center border transition-all duration-200",
                        patientType === "new"
                          ? "bg-secondary/20 border-secondary"
                          : "bg-secondary/10 border-secondary/20 hover:border-secondary/50"
                      )}
                    >
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        New Patient
                      </p>
                      <p className={`text-sm font-bold ${newPatientFee != null ? "text-secondary" : "text-muted-foreground"}`}>
                        {formatFee(newPatientFee)}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("patientType", "returning")}
                      className={cn(
                        "rounded-lg px-3 py-2 text-center border transition-all duration-200",
                        patientType === "returning"
                          ? "bg-primary/20 border-primary"
                          : "bg-primary/10 border-primary/20 hover:border-primary/50"
                      )}
                    >
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        Returning
                      </p>
                      <p className={`text-sm font-bold ${oldPatientFee != null ? "text-primary" : "text-muted-foreground"}`}>
                        {formatFee(oldPatientFee)}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Appointment type */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">Appointment Type</span>
                  </div>
                  {appointmentTypes.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">
                      Select a location to see appointment types
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {appointmentTypes.map((type) => {
                        const isSelected = appointmentTypeField.value === String(type.id);
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => appointmentTypeField.onChange(String(type.id))}
                            className={cn(
                              "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 border text-left transition-all duration-200",
                              isSelected
                                ? "bg-primary/10 border-primary"
                                : "bg-background border-border hover:border-primary/40 hover:bg-primary/5"
                            )}
                          >
                            <div className={cn(
                              "w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center",
                              isSelected ? "border-primary" : "border-muted-foreground/40"
                            )}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </div>
                            <div>
                              <p className={cn("text-xs font-medium", isSelected ? "text-primary" : "text-foreground")}>
                                {type.name}
                              </p>
                              {type.description && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">{type.description}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {errors.appointmentTypeId && (
                    <p className="text-xs text-destructive mt-1.5">{errors.appointmentTypeId.message}</p>
                  )}
                </div>

              </div>

              {/* Calendar + Time slots — side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">

                {/* Calendar */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarCheck2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">Select Date</span>
                  </div>
                  {isLoadingAvailability ? (
                    <div className="w-full h-56 rounded-xl bg-muted animate-pulse" />
                  ) : (
                    <Calendar
                      key={selectedLocation}
                      mode="single"
                      locale={enUS}
                      className="mx-auto"
                      selected={
                        dateField.value && !isNaN(new Date(dateField.value).getTime())
                          ? new Date(dateField.value)
                          : undefined
                      }
                      onSelect={(date) => {
                        dateField.onChange(date?.toISOString());
                        setValue("availableSlots", "");
                      }}
                      disabled={(date) =>
                        !selectedLocation ||
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        !isDayAvailable(date) ||
                        isDateUnavailable(date)
                      }
                      modifiers={{
                        available: (date) => isDayAvailable(date) && !isDateUnavailable(date),
                        unavailable: (date) => isDateUnavailable(date),
                      }}
                      modifiersClassNames={{
                        available: "bg-secondary/15 text-foreground font-medium",
                        unavailable: "bg-destructive/10 text-destructive line-through",
                        selected: "bg-primary! text-white! font-bold!",
                      }}
                    />
                  )}
                  {errors.availableDates && (
                    <p className="text-xs text-destructive mt-2 text-center">
                      {errors.availableDates.message}
                    </p>
                  )}
                </div>

                {/* Time slots */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">Available Time Slots</span>
                  </div>
                  {!selectedDate ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Select a date to see available slots
                    </p>
                  ) : isLoadingSlots ? (
                    <div className="flex flex-wrap gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
                      ))}
                    </div>
                  ) : !hasSlots ? (
                    <p className="text-xs text-destructive font-medium text-center py-4">
                      No slots available for this date
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(groupedSlots).map(
                        ([label, slots]) =>
                          slots.length > 0 && (
                            <div key={label}>
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                                {label}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {slots.map((slot, idx) => {
                                  const isSelected = slotField.value === slot.startTime;
                                  const isBooked =
                                    slot.available === false ||
                                    bookedStartTimes.has(slot.startTime);
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() =>
                                        !isBooked && slotField.onChange(slot.startTime)
                                      }
                                      className={cn(
                                        "text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all",
                                        isBooked
                                          ? "bg-destructive/10 text-destructive/60 border-destructive/20 line-through cursor-not-allowed"
                                          : isSelected
                                            ? "bg-primary text-white border-primary shadow-sm"
                                            : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                                      )}
                                    >
                                      {formatTimeTo12H(slot.startTime)} – {formatTimeTo12H(slot.endTime)}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  )}
                  {errors.availableSlots && (
                    <p className="text-xs text-destructive mt-2 text-center">
                      {errors.availableSlots.message}
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
