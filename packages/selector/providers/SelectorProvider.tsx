import React, {createContext, CSSProperties, PropsWithChildren, useEffect, useState} from "react";
import "intersection-observer";
import { SelectorItem } from "../components/SelectorItem";
import { SelectorMode, SelectorNode } from "../types/SelectorTypes";

interface ISelectorProvider {
  mode: SelectorMode,
  children: SelectorNode[],
  setChildren: (map: SelectorNode[]) => void,
}

export const SelectorContext = createContext<ISelectorProvider>({
  mode: "list",
  children: [],
  setChildren: (_array: SelectorNode[]) => {},
});

interface SelectorProviderProps extends PropsWithChildren {
  mode?: SelectorMode,
  width?: CSSProperties["width"],
  height?: CSSProperties["height"],
  direction?: CSSProperties["flexDirection"],
}

export const SelectorProvider = (props: SelectorProviderProps) => {
  const [children, setChildren] = useState<SelectorNode[]>([]);

  /**
   * initialize children for visualisation
   */
  useEffect(() => {
    const children = React.Children.toArray(props.children);
    const array: SelectorNode[] = [];
    children.map((element) => {
      array.push({
        id: `id-${Math.random().toString().replace(".", "")}`,
        element: React.Children.toArray(element),
        x: 0,
        y: 0,
      })
    });

    setChildren(array);
  }, [props.children]);

  /**
   * On drop event for canvas modality only
   * @param event 
   */
  const onDrop = (event: React.DragEvent<HTMLElement>) => {
    const currentId = event.dataTransfer.getData("dragStart");

    const x = event.nativeEvent.pageX;
    const y = event.nativeEvent.pageY;

    const elementCurrent = document.getElementById(currentId);
    if (elementCurrent) {
      if (props.mode === "canvas") {
        elementCurrent.style.position = "absolute";
        
        elementCurrent.style.left = x.toString() + "px";
        elementCurrent.style.top = y.toString() + "px";
      }
    }
    event.dataTransfer.clearData();
  }

  /**
   * preventDefault for onDragOver event so that onDrop can function 
   * @param event 
   * @returns 
   */
  const onDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    return false;
  }

  /**
   * Initialize container attribute values in base of the parents props "modality"
   * - onDrop activated to the parent element only for canvas modality since the the drop zone is defined by the container
   */
  let containerProps: React.HTMLAttributes<HTMLDivElement> = {};
  if (props.mode === "canvas") {
    containerProps.onDrop = onDrop;
  }

  return (
    <SelectorContext.Provider
      value={{
        mode: props.mode || "list",
        children,
        setChildren,
      }}
    >
      <div
        style={{
          width: props.width,
          height: props.height,
          border: "solid 1px black", // only for visualization, will be removed later
          display: "flex",
          flexDirection: props.direction || "column",
          flexWrap: "wrap",
        }}
        onDragOver={onDragOver}
        {...containerProps}
      >
        {children.map(node => (
          <SelectorItem key={node.id} id={node.id}>
            {node.element}
          </SelectorItem>
        ))}
      </div>
    </SelectorContext.Provider>
  )
}

SelectorProvider.defaultProps = {
  mode: "list",
}