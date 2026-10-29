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

export const CALL = { price: "₹199", minutes: 30, hours: "8 to 10 PM IST, every day" };

export const KITS = [
  { title: "App Store Rejection Playbook", line: "Every rejection I got and what fixed it" },
  { title: "Store Screenshot Kit", line: "HTML templates that render store shots" },
  { title: "App Launch Checklist", line: "What I check before every release" },
];
export const KIT_PRICE = { inr: "₹199", usd: "$7" };
