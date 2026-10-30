// Everything garoono.in sells, shown on /products. Gautam says when the course moves stage.
export type CourseStage = "waitlist" | "presale" | "launch";
export const COURSE_STAGE: CourseStage = "waitlist";

export const COURSE = {
  title: "Ship mobile apps with Claude Code",
  line: "From idea to App Store, the way I ship my own apps",
  includes: ["Recorded lessons", "My Flutter starter code", "One free 30 min call"],
  price: { waitlist: "₹999", presale: "₹1,499", launch: "₹1,999" } satisfies Record<CourseStage, string>,
  international: "$29",
};

export const CALL = { price: "₹399", minutes: 30, hours: "Tue, Thu, Sat, Sun 2 to 10 PM, Mon, Wed, Fri 8 to 10:30 PM IST" };

// Calls done before booking went live; first names only
export const CALLS_DONE = [
  { name: "Rohit", topic: "Picking a first app idea that can make money" },
  { name: "Ananya", topic: "App Store rejection under Guideline 4.3" },
  { name: "Karan", topic: "Setting up RevenueCat paywall and trials" },
  { name: "Sneha", topic: "Flutter folder structure with flutter_bloc" },
  { name: "Arjun", topic: "Getting the first 1,000 installs without ads" },
  { name: "Priya", topic: "Pricing a subscription for India vs the US" },
  { name: "Vikram", topic: "ASO keywords for a crowded category" },
  { name: "Neha", topic: "Building apps next to a 9 to 5 job" },
  { name: "Aditya", topic: "Store screenshots that get more taps" },
  { name: "Meera", topic: "Firebase costs and Remote Config switches" },
  { name: "Siddharth", topic: "Reading competitor reviews for feature ideas" },
  { name: "Ishaan", topic: "Adding AI features and what Apple asks" },
  { name: "Pooja", topic: "Localizing the listing into new countries" },
  { name: "Rahul", topic: "Why trial users cancel on the store sheet" },
  { name: "Divya", topic: "Planning a launch on Reddit and Instagram" },
];

export const KITS = [
  { title: "App Store Rejection Playbook", line: "Every rejection I got and what fixed it" },
  { title: "Store Screenshot Kit", line: "HTML templates that render store shots" },
  { title: "App Launch Checklist", line: "What I check before every release" },
];
export const KIT_PRICE = { inr: "₹199", usd: "$7" };
