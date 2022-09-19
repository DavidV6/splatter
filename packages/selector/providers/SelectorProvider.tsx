import "intersection-observer";
import React, { createContext, CSSProperties, PropsWithChildren, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { SelectorItem } from "../components/SelectorItem";
import { SelectionRange, SelectorMode, SelectorNode } from "../types/SelectorTypes";

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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionRange, setSelectionRange] = useState<SelectionRange>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    }
  }, []);

  /**
   * initialize children for visualisation
   */
  useEffect(() => {
    const children = React.Children.toArray(props.children);
    const array: SelectorNode[] = [];
    children.map((element) => {
      console.warn(React.Children.toArray(element));
      if (element) {

      }
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

    // change in mouse position related to element that is being dragged
    const changeX = event.dataTransfer.getData("changeX");
    const changeY = event.dataTransfer.getData("changeY");

    // new position of element = mouse position - change of mouse position
    const x = event.nativeEvent.pageX - parseInt(changeX);
    const y = event.nativeEvent.pageY - parseInt(changeY);

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
   * Group selection handlers
   */
  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (selectionRef.current && event.shiftKey){
      console.log("onMouseDown");

      selectionRef.current.style.display = "block";
      selectionRef.current.style.top = `${event.pageY.toString()}px`;
      selectionRef.current.style.left = `${event.pageX.toString()}px`;
      
      setSelectionRange({ startX: event.pageX, startY: event.pageY });
      setIsMouseDown(true);
    }
  }

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown && selectionRef.current) {
      console.log("onMouseMove");
      selectionRef.current.style.top = event.pageY > selectionRange.startY ? `${selectionRange.startY}px` : `${event.pageY}px`;
      selectionRef.current.style.left = event.pageX > selectionRange.startX ? `${selectionRange.startX}px` : `${event.pageX}px`;

      selectionRef.current.style.height = `${Math.abs(event.pageY - selectionRange.startY)}px`;
      selectionRef.current.style.width = `${Math.abs(event.pageX - selectionRange.startX)}px`;
    }
  }

  const onMouseUp = (event: MouseEvent) => {
    if (selectionRef.current) {
      console.log("onMouseUp");
      setIsMouseDown(false);

      const startX = parseInt(selectionRef.current.style.left);
      const startY = parseInt(selectionRef.current.style.top);
      const endX = startX + parseInt(selectionRef.current.style.width);
      const endY = startY + parseInt(selectionRef.current.style.height);

      selectionRef.current.style.display = "none";
      selectionRef.current.style.height = "0px";
      selectionRef.current.style.width = "0px";
      setSelectionRange({ startX, startY, endX, endY });
    }
  }

  useEffect(() => {
    const ret = [...children];
    let numberOfSelections = 0;
    ret.forEach((child) => {
      const element = document.getElementById(child.id);

      if (element) {
        const left = parseInt(element.style.left);
        const top = parseInt(element.style.top);
        const right = left + parseInt(element.style.width);
        const bottom = top + parseInt(element.style.height);

        const position = {left, top, right, bottom};
        // console.table(position);

        // console.table(selectionRange);
  
        if (
          top > selectionRange.startX &&
          left > selectionRange.startY &&
          right < (selectionRange.endX || 0) && 
          bottom < (selectionRange.endY || 0)
        ) {
          child.selected = true;
          numberOfSelections++;
        }
      }
    });
    console.log("number of selections: ", numberOfSelections);

    // setChildren(ret);
  }, [selectionRange]);

  // useCallback(
  //   () => {
  //     console.log("using callback!!!");
  //     const ret = [...children];
  //     let numberOfSelections = 0;
  //     ret.forEach((child) => {
  //       const element = document.getElementById(child.id);
  //       if (
  //         parseInt(element?.style.left || "0") > selectionRange.startX ||
  //         parseInt(element?.style.top || "0") < selectionRange.startY 
  //       ) {
  //         child.selected = true;
  //         numberOfSelections++;
  //       }
  //     });

  //     console.warn(numberOfSelections);

  //     setChildren(ret);
  //   },
  //   [selectionRange, children],
  // )
  

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
        ref={containerRef}
        id="selector-provider-container-id"
        style={{
          width: props.width,
          height: props.height,
          border: "solid 1px black", // only for visualization, will be removed later
          // display: props.mode === "canvas" ? "block" : "flex",
          display: "flex",
          flexDirection: props.direction || "column",
          flexWrap: "wrap",
        }}
        onDragOver={onDragOver}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        {...containerProps}
      >
        {children.map(node => (
          <SelectorItem key={node.id} id={node.id}>
            {node.element}
          </SelectorItem>
        ))}

        <div
          ref={selectionRef}
          style={{
            display: "none",
            position: "absolute",
            backgroundColor: "lightblue",
            opacity: ".5",
            border: "1px solid blue",
            height: "0px",
            width: "0px",
          }}
        />
      </div>
    </SelectorContext.Provider>
  )
}

SelectorProvider.defaultProps = {
  mode: "list",
}