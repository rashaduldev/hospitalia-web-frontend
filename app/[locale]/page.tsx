import FooterSection from "@/components/common/Footer";
import Banner from "@/components/pages/home/Banner";
import Header from "@/components/pages/home/Header";
import OurPackages from "@/components/pages/home/OurPackages";
import Stats from "@/components/pages/home/Stats";
import WhyChooseUs from "@/components/pages/home/WhyChooseUs";

export default function Page() {
  return (
    <>
      <Header />
      <Banner />
      <Stats />
      <WhyChooseUs />
      <OurPackages />
      <FooterSection />
    </>
  );
}
