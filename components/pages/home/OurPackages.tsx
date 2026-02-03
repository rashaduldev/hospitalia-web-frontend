"use client"
import PackageCard from "@/components/common/PackageCard";
import { useI18n } from "@/locales/client";

export type Productcard={
    image: string;
    title: string;
    list: string[];
    price: string;
    checkBtn: string;
}
const ourPackages:Productcard[] =[
    {
      image: "/assets/packages/cardiac.png",
      title: "Early Pregnancy Pack",
      list: [
        "Antenatal Checkup",
        "Ultrasound Scan",
        "Blood & Urine Tests",
      ],
      price: "300",
      checkBtn: "Check Details",
    },
    {
      image: "/",
      title: "General Health Checkup",
      list: [
        "Doctor Consultation",
        "Blood Pressure Check",
        "Basic Lab Tests",
      ],
      price: "200",
      checkBtn: "Check Details",
    },
    {
      image: "/",
      title: "Cardiac Care Package",
      list: [
        "ECG Test",
        "Heart Specialist Consultation",
        "Cholesterol Test",
      ],
      price: "450",
      checkBtn: "Check Details",
    },
  ]
const OurPackages = () => {
    const t = useI18n();
  return (
    <section className="section-container py-11">
      <h2 className="text-3xl font-semibold mb-10">
          {t("ourPackages.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:px-4">
            {ourPackages.map((pkg, index) => (
        <PackageCard pkg={{
                image: "",
                title: "",
                list: [],
                price: "",
                checkBtn: ""
            }} key={index} {...pkg} />
        ))}
        </div>
    </section>
  )
}

export default OurPackages
