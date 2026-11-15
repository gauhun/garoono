import type { Metadata } from "next";
import { appMetadata, renderAppPage } from "../../../components/apps/appRoute";
import {
  appPageBySlug,
  appPages,
  legacyAppSlugs,
} from "../../../data/appPages";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...appPages.map((p) => p.slug), ...Object.keys(legacyAppSlugs)].map(
    (slug) => ({ slug }),
  );
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return appMetadata((await params).slug);
}

export default async function AppPageRoute({ params }: Params) {
  const slug = (await params).slug;
  if (legacyAppSlugs[slug])
    return <MovedPage to={`/apps/${legacyAppSlugs[slug]}/`} />;
  const page = appPageBySlug(slug);
  if (page?.path) return <MovedPage to={page.path} />;
  return renderAppPage(slug);
}

// Static hosting has no server redirects, so old URLs forward with a meta refresh
function MovedPage({ to }: { to: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <p style={{ padding: 24 }}>
        Moved to <a href={to}>garoono.in{to}</a>
      </p>
    </>
  );
}
