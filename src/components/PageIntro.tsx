import { Reveal } from "./Reveal";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  lede?: string;
}

export function PageIntro({ eyebrow, title, lede }: PageIntroProps) {
  return (
    <section className="page-intro" aria-labelledby="page-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title" className="page-title">
            {title}
          </h1>
          {lede && <p className="page-lede">{lede}</p>}
        </Reveal>
      </div>
    </section>
  );
}
