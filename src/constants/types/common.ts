export interface withPagination<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export interface ICategory {
  id: number;
  name: string;
  image: string | null;
  children: ICategory[];
}
