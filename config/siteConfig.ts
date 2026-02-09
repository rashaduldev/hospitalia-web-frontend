export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    logo: "/assets/logo.svg",
    name: "",
    description:
        ".",
    ogTitle: "",
    ogImage: "/brand/og-image.jpg",
    url: process.env.NEXT_PUBLIC_API_URL || "",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_URL || "",
    appStoreUrl: " ",
    playStoreUrl:'',

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