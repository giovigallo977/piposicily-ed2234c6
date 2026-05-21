import { Link } from "react-router-dom";

const examples = [
  { name: "Valle del Belice + Cretto di Burri", desc: "Arte, paesaggi e storia in una giornata" },
  { name: "Bosco della Ficuzza + Real Tenuta", desc: "Natura, silenzio e pranzo immerso nel verde" },
  { name: "Piano Battaglia", desc: "Trekking e panorami lontani dalle folle" },
];

const ExperienceLanding = () => {
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
          Non vuoi organizzare nulla? Ti portiamo noi
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Piccoli gruppi, luoghi fuori dal turismo di massa, giornate pensate per farti scoprire la Sicilia senza stress.
        </p>
      </section>

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

      <section className="px-6 py-8 pb-20 max-w-2xl mx-auto text-center">
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Parti con noi, senza pensare a nulla.
          <br />Trasporto, percorso e tappe già organizzate.
          <br />Tu devi solo presentarti.
        </p>
      </section>
    </div>
  );
};

export default ExperienceLanding;
