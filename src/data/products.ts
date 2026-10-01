// Apps shown on the home page and in the blog rails

export interface Product {
  id: number;
  name: string;
  description: string;
  stat: string;
  icon: string;
  link: string;
  color: string; // wave accent color
}

export const products: Product[] = [
  {
    id: 13,
    name: "PushPass",
    description: "App blocker — do pushups, squats, planks or jumping jacks to unlock distracting apps.",
    stat: "4,000+",
    icon: "/logos/pushpass.png",
    link: "/apps/pushpass/",
    color: "#F97316",
  },
  {
    id: 2,
    name: "XLSheet AI",
    description: "AI spreadsheet assistant — formulas, SQL, regex & templates",
    stat: "21,000+ users",
    icon: "/logos/app_logo_compressed.png",
    link: "/apps/xlsheet-ai/",
    color: "#FF6B35",
  },
  {
    id: 14,
    name: "JapMala",
    description: "Digital 108-bead jaap mala — count mantras & track daily practice.",
    stat: "2,000+",
    icon: "/logos/japmala.png",
    link: "/apps/japmala/",
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
    link: "/apps/sparkmate/",
    color: "#EC4899",
  },
  {
    id: 3,
    name: "Habitide",
    description: "Build habits with friends. Track, prove, grow.",
    stat: "7,000+ users",
    icon: "/logos/habitide_logo.png",
    link: "/apps/habitide/",
    color: "#3B82F6",
  },
  {
    id: 11,
    name: "SnapPDF Pro",
    description: "SnapPDF is the PDF scanner, editor, and converter.",
    stat: "13,000+",
    icon: "/logos/snappdf_play.png",
    link: "/apps/snappdf-pro/",
    color: "#EAB308",
  },
  {
    id: 1,
    name: "Apna RSS",
    description: "Content & organisation app for volunteers",
    stat: "25,000+ users",
    icon: "/logos/rss_transparent.png",
    link: "/apps/apna-rss/",
    color: "#F59E0B",
  },
  {
    id: 6,
    name: "FocusOn",
    description: "Minimalist flip clock focus timer for deep work",
    stat: "5,000+ users",
    icon: "/logos/focuson_icon.png",
    link: "/apps/focuson/",
    color: "#8B5CF6",
  },
  {
    id: 4,
    name: "Shots",
    description: "Beautiful mockups & screenshot beautifier — turn raw captures into professional visuals.",
    stat: "2,000+",
    icon: "/logos/shots.png",
    link: "/apps/shots/",
    color: "#6366F1",
  },
  {
    id: 8,
    name: "XML Viewer",
    description: "XML editor, tree viewer, and converter",
    stat: "7,000+",
    icon: "/logos/xml_viewer.png",
    link: "/apps/xml-viewer/",
    color: "#06B6D4",
  },
  {
    id: 7,
    name: "JSON View : Editor",
    description: "Lightweight, privacy-first offline JSON editor and formatter",
    stat: "5,000+",
    icon: "/logos/json_viewer.png",
    link: "/apps/json-view/",
    color: "#10B981",
  },
  {
    id: 16,
    name: "NailMirror",
    description: "AI nail try-on — preview nail art & colors on your own hands.",
    stat: "4,000+",
    icon: "/logos/nailmirror.png",
    link: "/apps/nailmirror/",
    color: "#BE185D",
  },
  {
    id: 5,
    name: "BhaktiDhun",
    description: "Devotional music — bhajans, aartis, mantras",
    stat: "3,500+ users",
    icon: "/logos/bhakti_dhun_logo.png",
    link: "/apps/bhaktidhun/",
    color: "#EF4444",
  },
];
