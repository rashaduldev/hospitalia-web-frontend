"use client";

import { useState } from "react";
import DoctorWeeklyScheduleOverview from "./DoctorWeeklyScheduleOverview";
import AvailabilityScheduleForm from "./AvailabilityScheduleForm";
import ScheduleManager from "./ScheduleManager";
import ConfirmSlotsTable from "./ConfirmSlotsTable";

type Props = {
  userId: number;
  lang: string;
};

export default function DoctorAvailabilitySection({ userId, lang }: Props) {
  const [preselectedDay, setPreselectedDay] = useState<string | null>(null);
  const [preselectedLocationId, setPreselectedLocationId] = useState<number | undefined>(undefined);

  const handleAddSchedule = (day: string, locationId?: number) => {
    setPreselectedDay(day);
    setPreselectedLocationId(locationId);
  };

  const handleClose = () => {
    setPreselectedDay(null);
    setPreselectedLocationId(undefined);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <DoctorWeeklyScheduleOverview
        doctorUserId={userId}
        lang={lang}
        onAddSchedule={handleAddSchedule}
      />
      {preselectedDay !== null && (
        <AvailabilityScheduleForm
          lang={lang}
          doctorUserId={userId}
          preselectedDay={preselectedDay}
          preselectedLocationId={preselectedLocationId}
          onClose={handleClose}
        />
      )}
      <ScheduleManager lang={lang} doctorUserId={userId} />
      <ConfirmSlotsTable lang={lang} doctorUserId={userId} />
    </div>
  );
}
