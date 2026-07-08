// Gallery data — all 38 project photos from src/assets/
// Astro 7 import.meta.glob with `?url` gives us public-ready URLs at build time.

import type { ImageMetadata } from "astro";

export interface GalleryItem {
  src: ImageMetadata;
  alt: string;
  filename: string;
}

const modules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true }
);

// Filter out logo and get stable order
const entries = Object.entries(modules)
  .filter(([path]) => !path.includes("logo.png"))
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));

export const gallery: GalleryItem[] = entries.map(([path, module], i) => {
  const filename = path.split("/").pop() ?? `image-${i + 1}`;
  const baseName = filename.replace(/\.[^.]+$/, "");
  const altText = baseName.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    src: module.default,
    alt: altText,
    filename,
  };
});