import { Link } from "react-router-dom";

const examples = [
  { name: "Arte e Cultura", desc: "Passeggiata tra ville, dettagli e storia nascosta" },
  { name: "Luoghi Fantasma", desc: "Street art e quartieri fuori dalle rotte turistiche" },
  { name: "Natura", desc: "Tracce, mercati e influenze della città antica" },
];

const SelfGuidedLanding = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-6 pt-6">
        <Link to="/" className="font-heading text-2xl hover:opacity-70 transition-opacity">Pipo</Link>
        <div className="mt-1">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Torna alla scelta</Link>
        </div>
      </div>

      <section className="px-6 pt-12 pb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          Esplora la Sicilia senza sbagliare
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Itinerari già pronti per scoprire la città e i suoi angoli nascosti, senza perdere tempo tra blog, mappe e consigli confusi.
        </p>
      </section>

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

      <section className="px-6 py-8 pb-20 max-w-2xl mx-auto text-center">
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Percorsi semplici, testati sul campo, con indicazioni chiare su cosa vedere e come muoverti.
          <br />Segui il tracciato o usalo come base per la tua giornata.
        </p>
      </section>
    </div>
  );
};

export default SelfGuidedLanding;
