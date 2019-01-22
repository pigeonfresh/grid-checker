export interface Breakpoint {
  threshold: number;
  columns?: number;
  gutter?: number;
  color?: string;
  padding?: number;
}

export interface Options {
  columns: number;
  gutter: number;
  maxWidth: number;
  color: string;
  padding: number;
  className?: string;
  breakpoints?: Array<Breakpoint> | Array<null>;
}
