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
    />
  );
};

export default Banner;
