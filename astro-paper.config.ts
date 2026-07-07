import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://jordanthompson.dev/",
    title: "jordan thompson",
    description: "This is my website. Stay a while. Or dont.",
    author: "jordan thompson",
    profile: undefined,
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Australia/Brisbane",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
        enabled: true,
        url: "https://github.com/jordan-at/domoblog/edit/main/",
      },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/jordan-at" },
    { name: "linkedin", url: "https://www.linkedin.com/in/jordanalexthompson/" },
    { name: "mail",     url: "mailto:jrdan.thompson@gmail.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});