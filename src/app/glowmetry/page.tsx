import { appMetadata, renderAppPage } from "../../components/apps/appRoute";

export const metadata = appMetadata("glowmetry");

export default function GlowmetryPage() {
  return renderAppPage("glowmetry");
}
