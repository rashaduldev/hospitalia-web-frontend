import Header from "@/components/pages/home/Header";
import DoctorRegistrationForm from "@/components/pages/register/DoctorRegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Hospitalia | Registration',
  description: 'Create your Hospitalia account to access hospital services, manage appointments, and connect with healthcare professionals securely.',
}
export default function DoctorRegistrationPage() {
  return (
    <div>
      <Header />
      <h2 className="text-2xl text-card-foreground text-center p-7">
        Join Rendewou as a Provider
      </h2>
      <div className="min-h-screen bg-muted/40 px-4">
        <div className="container mx-auto">
          <DoctorRegistrationForm />
        </div>
      </div>
    </div>
  );
}
