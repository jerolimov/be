import { LoaderFunction } from "remix";
import { gql } from "graphql-request";
import { js2xml } from 'xml-js';
import { graphcms } from "~/data/graphql.server";
import { Category } from "~/types/categories";
import { Artwork } from "~/types/artworks";

const query = gql`
query {
  categories(orderBy: title_ASC) {
    id
    slug
    artworks(first: 1, orderBy: sortIndex_DESC) {
      id
      slug
      publishedAt
      importPublishedAt
    }
  }
  artworks(first 1000, orderBy: sortIndex_DESC) {
    id
    slug
    publishedAt
    importPublishedAt
  }
}
`;

interface QueryData {
  categories: Category[];
  artworks: Artwork[];
}

enum SitemapFrequency {
  always = 'always',
  hourly = 'hourly',
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
  never = 'never',
}

interface SitemapUrl {
  loc: string;
  // Date time, it allows you to omit the time portion and use just YYYY-MM-DD.
  lastmod?: string;
  changefreq?: SitemapFrequency | 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  days?: number;
}

interface SitemapUrlSet {
  _attributes: {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  },
  url: SitemapUrl[];
}

interface Sitemap {
  _declaration: {
    _attributes: {
      version: '1.0',
      encoding: string,
    },
  },	
  urlset: SitemapUrlSet;
}

export const frequencyForDays = (days: number): SitemapFrequency | undefined => {
  if (days >= 365) {
    return SitemapFrequency.yearly;
  } else if (days >= 30) {
    return SitemapFrequency.monthly;
  } else if (days >= 7) {
    return SitemapFrequency.weekly;
  } else if (days >= 1) {
    return SitemapFrequency.daily;
  } else if (days >= 0) {
    return SitemapFrequency.hourly;
  } else { // Negative values or NaN
    return undefined;
  }
}

export const linkToSitemapUrl = (baseURL: string, now = new Date()) => (path: string, published: Date | undefined): SitemapUrl => {
  const url: SitemapUrl = {
    loc: `${baseURL}/${path}`,
    lastmod: published?.toISOString().substring(0, 10),
  };
  if (published) {
    const days = (now.getTime() - published.getTime()) / (24 * 60 * 60 * 1000);
    const changefreq = frequencyForDays(days);
    if (changefreq) {
      url.changefreq = changefreq;
    }
  }
  return url;
}

export const homepageSitemapUrl = (baseURL: string): SitemapUrl => {
  return linkToSitemapUrl(baseURL)('', new Date());
}

export const categoryToSitemapUrl = (baseURL: string, now = new Date()) => (category: Category): SitemapUrl => {
  const newestArtwork = category.artworks?.[0];
  const published = newestArtwork ? new Date(newestArtwork.importPublishedAt || newestArtwork.publishedAt) : undefined;
  return linkToSitemapUrl(baseURL, now)(category.slug, published);
};

export const artworkToSitemapUrl = (baseURL: string, now = new Date()) => (artwork: Artwork): SitemapUrl => {
  const published = new Date(artwork.importPublishedAt || artwork.publishedAt);
  return linkToSitemapUrl(baseURL, now)(artwork.slug, published);
}

export const loader: LoaderFunction = async ({ request }): Promise<Response> => {
  const data = await graphcms.request<QueryData>(query);
  const baseURL = process.env.BASE_URL || request.url.substring(0, request.url.indexOf('/sitemap'));

  console.log(`Create sitemap with ${data.categories.length} categories and ${data.artworks.length} artworks.`)

  const sitemap: Sitemap = {
    _declaration: {
      _attributes: {
        version: '1.0',
        encoding: 'utf-8',
      },
    },	
    urlset: {
      _attributes: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      },
      url: [
        homepageSitemapUrl(baseURL),
        ...data.categories.map(categoryToSitemapUrl(baseURL)),
        ...data.artworks.map(artworkToSitemapUrl(baseURL)),
      ],
    },
  };

  const xml = js2xml(sitemap, { compact: true, spaces: 2 });
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      'Content-Length': String(xml.length),
    }
  });
};
