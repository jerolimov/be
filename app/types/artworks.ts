import { Category } from "./categories";

export interface ArtworkImage {
  id: string;
  url: string;
}

export interface Artwork {
  id: number | string;
  slug: string;
  title: string;
  technique: string;
  material: string;
  size: string;
  images: ArtworkImage[];
  categories: Category[];
}
