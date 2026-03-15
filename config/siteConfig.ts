export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  logo: "/assets/logo.svg",
  name: "Hospitalia",
  description:
    "Advanced healthcare solutions providing seamless patient management, appointments, and medical records.",
  ogTitle: "Hospitalia - Modern Healthcare Management",
  ogImage: "/brand/og-image.jpg",
  url: process.env.BASE_URL || "https://hospitalia-web.dhrubok.xyz",
  backend_url:
    process.env.NEXT_PUBLIC_API_URL || "https://hospitalia-api.dhrubok.xyz",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_URL || "",
  appStoreUrl: " ",
  playStoreUrl: "",

  links: {
    github: "https://github.com/handler",
    twitter: "https://twitter.com/handler",
    linkedIn: "https://www.linkedin.com/company/handler",
    facebook: "https://www.facebook.com/handler",
    instagram: "https://www.instagram.com/dhrubok.infotech",
    medium: "https://handler.medium.com",
    behance: "https://www.behance.net/handler",
    youtube: "https://youtube.com/",
  },
};
