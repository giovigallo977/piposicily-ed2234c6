import { useEffect } from "react";
import { trackEvent } from "@/lib/trackEvent";
import EmailCaptureForm from "@/components/EmailCaptureForm";

const examples = [
  { name: "Palermo Liberty", desc: "Passeggiata tra ville, dettagli e storia nascosta" },
  { name: "Palermo Graffiti", desc: "Street art e quartieri fuori dalle rotte turistiche" },
  { name: "Palermo Araba", desc: "Tracce, mercati e influenze della città antica" },
];

const SelfGuidedLanding = () => {
  useEffect(() => { trackEvent("page_view"); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal logo */}
      <div className="px-6 pt-6">
        <span className="font-heading text-2xl">Pipo</span>
      </div>

      {/* Hero */}
      <section className="px-6 pt-12 pb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          Esplora la Sicilia senza sbagliare
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Itinerari già pronti per scoprire la città e i suoi angoli nascosti, senza perdere tempo tra blog, mappe e consigli confusi.
        </p>
      </section>

      {/* Esempi */}
      <section className="px-6 py-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">I primi itinerari in arrivo</h2>
        <div className="flex flex-col gap-4">
          {examples.map((ex) => (
            <div key={ex.name} className="border border-border rounded-lg p-5">
              <p className="font-bold text-lg">{ex.name}</p>
              <p className="text-muted-foreground mt-1">{ex.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value */}
      <section className="px-6 py-8 max-w-2xl mx-auto text-center">
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Percorsi semplici, testati sul campo, con indicazioni chiare su cosa vedere e come muoverti.
          <br />Segui il tracciato o usalo come base per la tua giornata.
        </p>
      </section>

      {/* CTA Email */}
      <section className="px-6 py-10 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Vuoi accedere ai primi itinerari?</h2>
        <p className="text-muted-foreground mb-6">
          Stiamo aprendo i primi percorsi. Lascia la tua email e ti avvisiamo appena sono disponibili.
        </p>
        <EmailCaptureForm
          source="self_guided"
          ctaText="Avvisami"
          microcopy="Niente spam. Solo i primi itinerari Pipo."
        />
      </section>

      {/* Spacer + CTA ripetuta */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center border-t border-border">
        <p className="text-muted-foreground mb-4">Non perderti i primi itinerari</p>
        <EmailCaptureForm
          source="self_guided"
          ctaText="Avvisami"
          microcopy="Niente spam. Solo i primi itinerari Pipo."
        />
      </section>
    </div>
  );
};

export default SelfGuidedLanding;
