import React from "react";
import { staticFile } from "remotion";

// Families declared at runtime via an injected <style> using staticFile URLs.
// Avoids webpack resolving the woff2 and avoids delayRender (render-safe).
export const fonts = {
  display: "Archivo Black",
  ui: "Inter",
} as const;

export const FontFaces: React.FC = () => (
  <style>
    {`
      @font-face {
        font-family: "Archivo Black";
        font-style: normal;
        font-weight: 400;
        font-display: block;
        src: url("${staticFile("fonts/ArchivoBlack.woff2")}") format("woff2");
      }
      @font-face {
        font-family: "Inter";
        font-style: normal;
        font-weight: 100 900;
        font-display: block;
        src: url("${staticFile("fonts/Inter.woff2")}") format("woff2");
      }
    `}
  </style>
);

export const displayStyle: React.CSSProperties = {
  fontFamily: fonts.display,
  textTransform: "uppercase",
  letterSpacing: "0.01em",
  lineHeight: 0.96,
};

export const uiStyle: React.CSSProperties = {
  fontFamily: fonts.ui,
};
