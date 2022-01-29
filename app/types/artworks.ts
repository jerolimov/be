import { Category } from "./categories";

export interface ArtworkImage {
  id: string;
  width: number;
  height: number;
  url: string;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  technique: string;
  material: string;
  size: string;
  images: ArtworkImage[];
  categories: Category[];
  sortIndex: number;
  publishedAt: Date;
  importPublishedAt: Date;
}
