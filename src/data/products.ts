// Apps shown on the home page and in the blog rails

export interface Product {
  id: number;
  name: string;
  description: string;
  stat: string;
  icon: string;
  link: string;
  iosLink?: string; // App Store link, used instead of `link` on Apple devices
  color: string; // wave accent color
}

export const products: Product[] = [
  {
    id: 13,
    name: "PushPass",
    description: "App blocker — do pushups to unlock distracting apps.",
    stat: "4,000+",
    icon: "/logos/pushpass.png",
    link: "https://pushpass.in",
    color: "#F97316",
  },
  {
    id: 2,
    name: "XLSheet AI",
    description: "AI spreadsheet assistant — formulas, SQL, regex & templates",
    stat: "21,000+ users",
    icon: "/logos/app_logo_compressed.png",
    link: "https://xlsheetai.com",
    color: "#FF6B35",
  },
  {
    id: 14,
    name: "JapMala",
    description: "Digital 108-bead jaap mala — count mantras & track daily practice.",
    stat: "2,000+",
    icon: "/logos/japmala.png",
    link: "https://japmala.pro",
    color: "#14B8A6",
  },
  {
    id: 12,
    name: "Dress Mirror",
    description: "Virtual trial room to try outfits instantly.",
    stat: "4,000+",
    icon: "/logos/dressmirror.png",
    link: "/apps/dress-mirror/",
    color: "#D946EF",
  },
  {
    id: 15,
    name: "SparkMate",
    description: "AI companion chat — talk, vent & have fun anytime.",
    stat: "500+",
    icon: "/logos/sparkmate.png",
    link: "https://play.google.com/store/apps/details?id=in.garoono.sparkmate",
    color: "#EC4899",
  },
  {
    id: 3,
    name: "Habitide",
    description: "Build habits with friends. Track, prove, grow.",
    stat: "7,000+ users",
    icon: "/logos/habitide_logo.png",
    link: "https://habitide.in",
    color: "#3B82F6",
  },
  {
    id: 11,
    name: "SnapPDF Pro",
    description: "SnapPDF is the PDF scanner, editor, and converter.",
    stat: "13,000+",
    icon: "/logos/snappdf_play.png",
    link: "https://linktr.ee/snappdfpro",
    color: "#EAB308",
  },
  {
    id: 1,
    name: "Apna RSS",
    description: "Content & organisation app for volunteers",
    stat: "25,000+ users",
    icon: "/logos/rss_transparent.png",
    link: "https://play.google.com/store/apps/details?id=com.garoono.apnarss",
    color: "#F59E0B",
  },
  {
    id: 6,
    name: "FocusOn",
    description: "Minimalist flip clock focus timer for deep work",
    stat: "5,000+ users",
    icon: "/logos/focuson_icon.png",
    link: "https://linktr.ee/focusontimer",
    color: "#8B5CF6",
  },
  {
    id: 4,
    name: "Shots",
    description: "Beautiful mockups & screenshot beautifier — turn raw captures into professional visuals.",
    stat: "2,000+",
    icon: "/logos/shots.png",
    link: "https://linktr.ee/shots_screenshot_beautifier",
    color: "#6366F1",
  },
  {
    id: 8,
    name: "XML Viewer",
    description: "XML editor, tree viewer, and converter",
    stat: "7,000+",
    icon: "/logos/xml_viewer.png",
    link: "https://play.google.com/store/apps/details?id=in.garoono.xmlviewer",
    color: "#06B6D4",
  },
  {
    id: 7,
    name: "JSON View : Editor",
    description: "Lightweight, privacy-first offline JSON editor and formatter",
    stat: "5,000+",
    icon: "/logos/json_viewer.png",
    link: "https://play.google.com/store/apps/details?id=in.garoono.jsonviewer",
    color: "#10B981",
  },
  {
    id: 16,
    name: "NailMirror",
    description: "AI nail try-on — preview nail art & colors on your own hands.",
    stat: "4,000+",
    icon: "/logos/nailmirror.png",
    link: "https://play.google.com/store/apps/details?id=in.garoono.nailmirror",
    iosLink: "https://apps.apple.com/in/app/nailmirror-ai-nail-try-on-art/id6788501057",
    color: "#BE185D",
  },
  {
    id: 5,
    name: "BhaktiDhun",
    description: "Devotional music — bhajans, aartis, mantras",
    stat: "3,500+ users",
    icon: "/logos/bhakti_dhun_logo.png",
    link: "https://play.google.com/store/apps/details?id=com.garoono.bhaktidhunsanatan",
    color: "#EF4444",
  },
];
