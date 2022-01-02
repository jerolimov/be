import { Artwork } from "./artworks";

export interface Category {
  id: number | string;
  slug: string;
  title: string;
  artworks?: Artwork[];
  count?: number;
}
