import type { ReactNode } from "react";
import { PaletteSwitcher } from "@/components/PaletteSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const PALETTE_SCRIPT = `try{var ids=["arena","coral","salvia","marea","atardecer"];var q=new URLSearchParams(window.location.search).get("paleta");var p=ids.indexOf(q)>-1?q:window.localStorage.getItem("laserena-palette");if(p&&ids.indexOf(p)>-1&&p!=="arena"){var s=document.currentScript;if(s&&s.parentElement){s.parentElement.dataset.palette=p}}}catch(e){}`;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="public-theme"
      data-palette="arena"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: PALETTE_SCRIPT }} />
      <SiteHeader />
      <main id="contenido">{children}</main>
      <SiteFooter />
      <PaletteSwitcher />
    </div>
  );
}
