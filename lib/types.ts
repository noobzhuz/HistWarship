export type MuseumSite = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number];
  summary: string;
  image: string;
  shipSlugs: string[];
};

export type Ship = {
  id: string;
  slug: string;
  name: string;
  className: string;
  type: string;
  launched: number;
  country: string;
  siteSlug: string;
  summary: string;
  image: string;
};
