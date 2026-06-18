// AIGO Studios brand palette, lifted from css/style.css of the pitch deck.
export const theme = {
  ink: "#08090B",
  ink2: "#0E0F12",
  paper: "#F2F2F2",
  accent: "#FF4627",
  accentSoft: "#ff7a5f",
  lime: "#BDFF5F",
  font:
    '"Inter", "Helvetica Neue", -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
} as const;

export type Slide = {
  kicker: string;
  title: string;
  body?: string;
};

// The narrative spine of the deck — edit/extend to match the live slides.
export const slides: Slide[] = [
  {
    kicker: "AIGO STUDIOS",
    title: "Play the world.",
    body: "An AI-native game studio building the next generation of interactive worlds.",
  },
  {
    kicker: "THE VAULT",
    title: "Four doors, one engine.",
    body: "Football. Hollywood. Music. Streaming. Every IP becomes a playable universe.",
  },
  {
    kicker: "WHY NOW",
    title: "Generative content meets live ops.",
    body: "Production costs collapse while player expectations explode.",
  },
  {
    kicker: "THE ASK",
    title: "Let's build the vault together.",
    body: "Join the round shaping AI-native entertainment.",
  },
];
