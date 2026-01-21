import pipoAlien from "@/assets/pipo-alien.png";

const MinimalHeader = () => {
  return (
    <header className="bg-background py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center">
          <h1 className="font-brand text-xl font-black italic tracking-tight text-foreground">
            Pipo
          </h1>
          <img
            src={pipoAlien}
            alt="Logo Pipo"
            className="h-7 w-7 object-contain ml-2"
            draggable={false}
          />
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;
