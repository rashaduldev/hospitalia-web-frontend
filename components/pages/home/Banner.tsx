import { getCurrentLocale, getI18n } from "@/locales/server";
import { SearchForm } from "./SearchForm";
import { Typography } from "@/components/ui/Typography";

const Banner = async () => {
  const t = await getI18n();
  const lang = await getCurrentLocale();

  return (
    <section
      className="relative w-full bg-cover bg-center h-130 sm:h-150 lg:h-150"
      style={{ backgroundImage: 'url("/assets/banner.png")' }}
    >
      <div className="absolute bottom-0 w-full bg-primary/75 px-4 py-8 lg:px-14.5 text-muted font-extrabold md:tracking-[-1.8px] text-xl leading-tight sm:text-4xl lg:text-[75px] lg:leading-16.25">
        <Typography
          className="text-muted font-extrabold text-xl sm:text-4xl lg:text-[60px] leading-tight"
          as="h1"
        >
          {t("banner.titleMain")}
        </Typography>
        <Typography
          color="muted"
          className="font-bold text-sm sm:text-2xl lg:text-[38px]"
          as="h2"
        >
          {t("banner.titleSub")}
        </Typography>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-10 lg:left-14 lg:translate-x-0 lg:top-8">
        <SearchForm
          className="bg-background"
          lang={lang}
          headingTitle={t("banner.cardTitle")}
          headingSubtitle={t("banner.cardSubtitle")}
        />
      </div>
    </section>
  );
};

export default Banner;
