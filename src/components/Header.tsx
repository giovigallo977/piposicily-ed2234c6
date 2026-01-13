import pipoAlien from "@/assets/pipo-alien.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-brand text-2xl font-black italic tracking-tight text-foreground">
            Pipo
          </h1>

          <img
            src={pipoAlien}
            alt="Logo Pipo"
            className="h-9 w-9 object-contain"
            draggable={false}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
