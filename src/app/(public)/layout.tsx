import type { ReactNode } from "react";
import { SeasonBand } from "@/components/SeasonBand";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <SeasonBand />
      <main id="contenido">{children}</main>
      <SiteFooter />
    </>
  );
}
