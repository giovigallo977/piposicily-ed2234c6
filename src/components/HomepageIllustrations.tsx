/**
 * Inline SVG illustrations for the homepage.
 * Style: handmade line-art, thin strokes, flat accent fills (olive green, warm beige).
 * Remove this file + imports in HeroSection to revert to the previous look.
 */

interface IllustrationProps {
  className?: string;
}

/* ─── Backpacker walking (medium, hero) ─── */
export const BackpackerIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Hat */}
    <ellipse cx="100" cy="42" rx="22" ry="8" fill="hsl(var(--olive) / 0.15)" stroke="hsl(var(--foreground))" strokeWidth="1.8" />
    <path d="M82 42 Q100 18 118 42" fill="hsl(var(--olive) / 0.25)" stroke="hsl(var(--foreground))" strokeWidth="1.8" strokeLinecap="round" />
    {/* Head */}
    <circle cx="100" cy="56" r="14" fill="hsl(48 96% 89% / 0.5)" stroke="hsl(var(--foreground))" strokeWidth="1.8" />
    {/* Eyes */}
    <circle cx="95" cy="54" r="1.5" fill="hsl(var(--foreground))" />
    <circle cx="105" cy="54" r="1.5" fill="hsl(var(--foreground))" />
    {/* Smile */}
    <path d="M96 60 Q100 64 104 60" stroke="hsl(var(--foreground))" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    {/* Body */}
    <path d="M100 70 L100 130" stroke="hsl(var(--foreground))" strokeWidth="1.8" strokeLinecap="round" />
    {/* Arms */}
    <path d="M100 85 L75 105" stroke="hsl(var(--foreground))" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M100 85 L125 100" stroke="hsl(var(--foreground))" strokeWidth="1.8" strokeLinecap="round" />
    {/* Walking stick */}
    <path d="M75 105 L68 160" stroke="hsl(var(--olive))" strokeWidth="2" strokeLinecap="round" />
    {/* Legs - walking pose */}
    <path d="M100 130 L82 175" stroke="hsl(var(--foreground))" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M100 130 L118 170" stroke="hsl(var(--foreground))" strokeWidth="1.8" strokeLinecap="round" />
    {/* Feet */}
    <path d="M82 175 L74 178" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
    <path d="M118 170 L126 173" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
    {/* Backpack */}
    <rect x="104" y="72" width="20" height="28" rx="4" fill="hsl(var(--olive) / 0.2)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    <path d="M108 72 L108 68 Q108 65 112 65 L116 65 Q120 65 120 68 L120 72" stroke="hsl(var(--foreground))" strokeWidth="1.2" fill="none" />
    {/* Small ground line */}
    <path d="M60 180 Q100 185 140 178" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/* ─── Tent (small decorative) ─── */
export const TentIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 52 L40 12 L70 52 Z" fill="hsl(var(--olive) / 0.15)" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M30 52 L40 32 L50 52" stroke="hsl(var(--foreground))" strokeWidth="1.2" strokeLinejoin="round" fill="hsl(var(--olive) / 0.08)" />
    <path d="M40 12 L40 6" stroke="hsl(var(--foreground))" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M38 6 L42 4 L40 8" fill="hsl(var(--olive) / 0.4)" stroke="none" />
    <path d="M5 52 L75 52" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1" />
  </svg>
);

/* ─── Jeep (small decorative) ─── */
export const JeepIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 90 55" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <rect x="10" y="18" width="65" height="22" rx="4" fill="hsl(var(--olive) / 0.15)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    {/* Roof */}
    <path d="M22 18 L28 6 L58 6 L64 18" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="hsl(48 96% 89% / 0.3)" strokeLinejoin="round" />
    {/* Windows */}
    <rect x="30" y="8" width="10" height="9" rx="1" fill="hsl(var(--olive) / 0.1)" stroke="hsl(var(--foreground))" strokeWidth="1" />
    <rect x="44" y="8" width="10" height="9" rx="1" fill="hsl(var(--olive) / 0.1)" stroke="hsl(var(--foreground))" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="25" cy="42" r="7" fill="hsl(var(--foreground) / 0.1)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    <circle cx="25" cy="42" r="3" fill="hsl(var(--foreground) / 0.05)" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
    <circle cx="60" cy="42" r="7" fill="hsl(var(--foreground) / 0.1)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    <circle cx="60" cy="42" r="3" fill="hsl(var(--foreground) / 0.05)" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
    {/* Headlight */}
    <circle cx="76" cy="28" r="2.5" fill="hsl(48 96% 89% / 0.6)" stroke="hsl(var(--foreground))" strokeWidth="1" />
  </svg>
);

/* ─── Compass (small decorative) ─── */
export const CompassIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="30" cy="30" r="24" fill="hsl(48 96% 89% / 0.3)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    <circle cx="30" cy="30" r="20" fill="none" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="0.8" />
    {/* N-S needle */}
    <path d="M30 10 L33 30 L30 50 L27 30 Z" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" />
    <path d="M30 10 L33 30 L27 30 Z" fill="hsl(var(--olive) / 0.4)" />
    <path d="M30 50 L33 30 L27 30 Z" fill="hsl(var(--foreground) / 0.15)" />
    {/* Center */}
    <circle cx="30" cy="30" r="2" fill="hsl(var(--foreground))" />
    {/* Cardinal marks */}
    <text x="30" y="9" textAnchor="middle" fontSize="5" fill="hsl(var(--foreground))" fontFamily="Inter" fontWeight="600">N</text>
  </svg>
);

/* ─── Couple exploring (small decorative) ─── */
export const CoupleIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Person 1 */}
    <circle cx="35" cy="22" r="9" fill="hsl(48 96% 89% / 0.4)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    <path d="M35 31 L35 65" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M35 42 L22 55" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M35 42 L48 50" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M35 65 L25 90" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M35 65 L45 88" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    {/* Person 2 */}
    <circle cx="62" cy="20" r="9" fill="hsl(var(--olive) / 0.15)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    <path d="M62 29 L62 63" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M62 40 L50 52" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M62 40 L75 48" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M62 63 L52 88" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M62 63 L72 86" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    {/* Holding hands hint */}
    <path d="M48 50 Q50 51 50 52" stroke="hsl(var(--olive))" strokeWidth="1.5" strokeLinecap="round" />
    {/* Ground */}
    <path d="M15 92 Q50 96 85 90" stroke="hsl(var(--foreground) / 0.15)" strokeWidth="1" />
  </svg>
);

/* ─── Map reader sitting (small, mission section) ─── */
export const MapReaderIllustration = ({ className }: IllustrationProps) => (
  <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Head */}
    <circle cx="50" cy="22" r="11" fill="hsl(48 96% 89% / 0.4)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    {/* Eyes */}
    <circle cx="47" cy="21" r="1.2" fill="hsl(var(--foreground))" />
    <circle cx="54" cy="21" r="1.2" fill="hsl(var(--foreground))" />
    {/* Body - sitting */}
    <path d="M50 33 L50 60" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    {/* Arms holding map */}
    <path d="M50 45 L35 50 L35 70" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M50 45 L70 50 L70 70" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" />
    {/* Map */}
    <rect x="33" y="48" width="39" height="24" rx="2" fill="hsl(var(--olive) / 0.1)" stroke="hsl(var(--foreground))" strokeWidth="1.2" />
    <path d="M40 55 L60 55 M40 60 L55 60 M40 65 L50 65" stroke="hsl(var(--foreground) / 0.3)" strokeWidth="0.8" />
    <circle cx="58" cy="63" r="3" stroke="hsl(var(--olive))" strokeWidth="1" fill="hsl(var(--olive) / 0.15)" />
    {/* Legs - sitting cross-legged */}
    <path d="M50 60 L38 75 L50 70" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 60 L62 75 L50 70" stroke="hsl(var(--foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Ground */}
    <path d="M20 78 Q55 82 90 76" stroke="hsl(var(--foreground) / 0.15)" strokeWidth="1" />
  </svg>
);
