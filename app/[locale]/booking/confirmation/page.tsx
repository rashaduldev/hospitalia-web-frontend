import Header from "@/components/pages/home/Header";
import FooterSection from "@/components/common/Footer";
import { getCurrentLocale } from "@/locales/server";
import { CheckCircle2, CalendarDays, Clock, MapPin, Banknote, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Hospitalia - Booking Confirmed" };

const SectionHeading = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm font-semibold text-foreground">{label}</span>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">{label}</p>
    <p className="text-sm font-medium text-foreground text-right break-all">{value}</p>
  </div>
);

const BookingConfirmationPage = async ({ searchParams }: { searchParams: Promise<any> }) => {
  await getCurrentLocale();
  const sParams = await searchParams;

  const bookingInfo = {
    doctorName: sParams.doctorName || "",
    designation: sParams.designation || "",
    location: sParams.location || "",
    date: sParams.date || "",
    startTime: sParams.startTime || "",
    endTime: sParams.endTime || "",
    price: sParams.price || "",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="border border-border rounded-xl bg-card shadow-sm w-full max-w-md overflow-hidden">
          {/* Success header */}
          <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 bg-secondary/5 border-b border-border">
            <div className="p-3 bg-secondary/15 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-base font-bold text-foreground">Appointment Booked!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your request has been submitted successfully.
            </p>
          </div>

          {/* Summary */}
          <div className="px-6 py-6">
            <SectionHeading icon={CalendarDays} label="Appointment Summary" />
            <div>
              <DetailRow label="Doctor" value={bookingInfo.doctorName} />
              {bookingInfo.designation && (
                <DetailRow label="Designation" value={bookingInfo.designation} />
              )}
              <DetailRow label="Location" value={bookingInfo.location} />
              <DetailRow label="Date" value={bookingInfo.date} />
              <DetailRow label="Time" value={`${bookingInfo.startTime} – ${bookingInfo.endTime}`} />
              <DetailRow label="Fee" value={bookingInfo.price} />
            </div>
          </div>

          <Separator />

          {/* Note + CTA */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 border border-border px-4 py-3">
              <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Availability is subject to confirmation by the doctor.
              </p>
            </div>
            <Button asChild className="w-full font-semibold h-11">
              <Link href="/patient/dashboard">View My Appointments</Link>
            </Button>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default BookingConfirmationPage;
