import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Observatório de Saúde",
    short_name: "Obs. Saúde",
    description:
      "Painel público com dados de COVID-19, dengue, zika e chikungunya no Brasil.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f9f9f7",
    theme_color: "#256abf",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
