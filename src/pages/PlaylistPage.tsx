import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const PlaylistPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="px-6 md:px-12 py-10 md:py-14 pb-24">
        <h2 className="font-sans uppercase tracking-widest text-[11px] md:text-xs text-foreground/60 mb-10">
          {t("navPlaylist")}
        </h2>
        <div className="max-w-3xl mx-auto">
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/6u8rWGnZeiU5OPezbBlLfS?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Pipo Playlist"
          />
        </div>
      </main>
    </div>
  );
};

export default PlaylistPage;
