export interface FreepikData {
  data: Resource[];
  meta: Meta;
}

export interface Resource {
  id: number;
  title: string;
  url: string;
  filename: string;
  licenses: License[];
  products: Product[];
  meta: MetaResource;
  image: Image;
  related: Related;
  stats: Stats;
  author: Author;
  active: boolean;
}

export interface License {
  type: string;
  url: string;
}

export interface Product {
  type: string;
  url: string;
}

export interface MetaResource {
  published_at: string;
  is_new: boolean;
  available_formats: AvailableFormats;
}

export interface AvailableFormats {
  eps?: Eps;
  jpg?: Jpg;
  svg?: Svg;
  png: Png;
  ai?: Ai;
  fonts?: Fonts;
}

export interface Eps {
  total: number;
  items: Item[];
}

export interface Item {
  size: number;
  id: number;
}

export interface Jpg {
  total: number;
  items: Item2[];
}

export interface Item2 {
  size: number;
  id: number;
}

export interface Svg {
  total: number;
  items: Item3[];
}

export interface Item3 {
  size: number;
  id: number;
}

export interface Png {
  total: number;
  items: Item4[];
}

export interface Item4 {
  size: number;
  id: number;
}

export interface Ai {
  total: number;
  items: Item5[];
}

export interface Item5 {
  size: number;
  id: number;
}

export interface Fonts {
  total: number;
  items: Item6[];
}

export interface Item6 {
  size: number;
  id: number;
}

export interface Image {
  type: string;
  orientation: string;
  source: Source;
}

export interface Source {
  key: string;
  url: string;
  size: string;
}

export interface Related {
  serie: any[];
  others: any[];
  keywords: any[];
}

export interface Stats {
  downloads: number;
  likes: number;
}

export interface Author {
  id: number;
  name: string;
  avatar: string;
  assets: number;
  slug: string;
}

export interface Meta {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
  clean_search: boolean;
}

export interface FreepikDownloadData {
  data: Daum[];
}

export interface Daum {
  filename: string;
  url: string;
}
