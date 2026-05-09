import { getI18n } from "@/locales/server";
import BannerSlider from "./BannerSlider";

const Banner = async () => {
  const t = await getI18n();

  return (
    <BannerSlider
      cardTitle={t("banner.cardTitle")}
      cardSubtitle={t("banner.cardSubtitle")}
      titleMain={t("banner.titleMain")}
      titleSub={t("banner.titleSub")}
      eyebrow={t("banner.eyebrow")}
      chips={[
        t("banner.chip0"),
        t("banner.chip1"),
        t("banner.chip2"),
      ]}
      metrics={[
        { value: t("banner.metric0.value"), label: t("banner.metric0.label") },
        { value: t("banner.metric1.value"), label: t("banner.metric1.label") },
        { value: t("banner.metric2.value"), label: t("banner.metric2.label") },
      ]}
      stripItems={[
        t("banner.strip0"),
        t("banner.strip1"),
        t("banner.strip2"),
      ]}
    />
  );
};

export default Banner;
