import { useEffect } from "react";
import { trackEvent } from "@/lib/trackEvent";
import EmailCaptureForm from "@/components/EmailCaptureForm";

const examples = [
  { name: "Valle del Belice + Cretto di Burri", desc: "Arte, paesaggi e storia in una giornata" },
  { name: "Bosco della Ficuzza + Real Tenuta", desc: "Natura, silenzio e pranzo immerso nel verde" },
  { name: "Piano Battaglia", desc: "Trekking e panorami lontani dalle folle" },
];

const ExperienceLanding = () => {
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
          Non vuoi organizzare nulla? Ti portiamo noi
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Piccoli gruppi, luoghi fuori dal turismo di massa, giornate pensate per farti scoprire la Sicilia senza stress.
        </p>
      </section>

      {/* Esempi */}
      <section className="px-6 py-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">Le prime experience in arrivo</h2>
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
          Parti con noi, senza pensare a nulla.
          <br />Trasporto, percorso e tappe già organizzate.
          <br />Tu devi solo presentarti.
        </p>
      </section>

      {/* CTA Email */}
      <section className="px-6 py-10 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Vuoi partecipare alle prime experience?</h2>
        <p className="text-muted-foreground mb-6">
          Stiamo aprendo le prime date. Lascia la tua email e ti avviseremo prima degli altri.
        </p>
        <EmailCaptureForm
          source="experience"
          ctaText="Avvisami quando aprono"
          microcopy="Accesso anticipato alle prime uscite Pipo."
        />
      </section>

      {/* CTA ripetuta */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center border-t border-border">
        <p className="text-muted-foreground mb-4">Non perderti le prime date</p>
        <EmailCaptureForm
          source="experience"
          ctaText="Avvisami quando aprono"
          microcopy="Accesso anticipato alle prime uscite Pipo."
        />
      </section>
    </div>
  );
};

export default ExperienceLanding;
