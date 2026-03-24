import Banner from "@/components/pages/home/Banner";
import DoctorCTA from "@/components/pages/home/DoctorCTA";
import Header from "@/components/pages/home/Header";
import OurPackages from "@/components/pages/home/OurPackages";
import Stats from "@/components/pages/home/Stats";
import WhyChooseUs from "@/components/pages/home/WhyChooseUs";
import FooterSection from "@/components/common/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Comprehensive Healthcare",
  description:
    "Explore Hospitalia's premium healthcare services, flexible medical packages, and state-of-the-art facilities. Your health is our priority.",
  keywords: [
    "Hospitalia Home",
    "Medical Packages",
    "Health Statistics",
    "Why Choose Hospitalia",
    "Healthcare Services",
  ],
  alternates: {
    canonical: "https://hospitalia-web.dhrubok.xyz",
  },
  openGraph: {
    title: "Hospitalia - Your Partner in Health",
    description:
      "Discover our specialized medical packages and modern healthcare infrastructure.",
    url: "https://hospitalia-web.dhrubok.xyz",
    images: [
      {
        url: "/assets/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Hospitalia Home Page",
      },
    ],
  },
};

export default async function HomePage() {
  return (
    <>
      <Header />
      <Banner />
      <Stats />
      <WhyChooseUs />
      <OurPackages />
      <DoctorCTA />
      <FooterSection />
    </>
  );
}
