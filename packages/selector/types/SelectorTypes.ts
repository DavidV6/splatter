import { ReactElement, ReactNode } from "react";

export type SelectorMode = "canvas" | "list";

export type SelectorNode = {
  id: string;
  element: ReactElement | ReactNode,
  selected?: boolean,
  x?: number;
  y?: number;
}

export type SelectionRange = {
  startX: number,
  startY: number,
  endX?: number,
  endY?: number,
}