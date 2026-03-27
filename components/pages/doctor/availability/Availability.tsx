import DoctorAvailabilitySection from "./DoctorAvailabilitySection";

const Availability = async ({
  userId,
  lang,
}: {
  lang: string;
  userId: number;
}) => {
  return (
    <DoctorAvailabilitySection
      userId={userId}
      lang={lang}
    />
  );
};

export default Availability;
