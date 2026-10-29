import type { Metadata } from "next";
import Products from "../../components/Products";

export const metadata: Metadata = {
  title: "Products · Gautam | Course, kits, docs and 1:1 calls for app makers",
  description: "Everything I sell: a course on shipping mobile apps with Claude Code, kits, the docs pass and paid 1:1 calls.",
  alternates: { canonical: "/products/" },
};

export default function ProductsPage() {
  return <Products />;
}
