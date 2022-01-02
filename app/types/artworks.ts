import { Category } from "./categories";

export interface ArtworkImage {
  id: string;
  url: string;
}

export interface Artwork {
  id: number | string;
  slug: string;
  title: string;
  /** Markdown */
  content: string;
  images: ArtworkImage[];
  categories: Category[];
}
