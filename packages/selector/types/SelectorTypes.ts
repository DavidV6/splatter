import { ReactElement, ReactNode } from "react";

export type SelectorMode = "canvas" | "list";

export type SelectorNode = {
  id: string;
  element: ReactElement | ReactNode,
  x?: number;
  y?: number;
}