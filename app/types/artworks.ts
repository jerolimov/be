export interface Artwork {
  id: number | string;
  slug: string;
  title: string;
  // Markdown?
  content: string;
  image: {
    url: string;
  };
}
