import React, { CSSProperties, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import { SelectorContext } from '../providers/SelectorProvider';
import { SelectorMode, SelectorNode } from '../types/SelectorTypes';

interface Props extends PropsWithChildren {
  id?: string;
  selected?: boolean,
  style?: CSSProperties;
}

export const SelectorItem = (props: Props) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const selectorContext = useContext(SelectorContext);

  /**
   * Move the element through the list of children
   * Used only in list modality
   * @param currentId 
   * @param moveId 
   * @returns 
   */
  const moveElement = (currentId: string, moveId: string) => {
    const children = Object.assign<SelectorNode[], SelectorNode[] | undefined>([], selectorContext.children) || [];
    
    const currentIndex: number = children?.findIndex(el => el.id === currentId) || 0;
    const moveIndex: number = children?.findIndex(el => el.id === moveId) || 0;

    const diff = currentIndex - moveIndex;
    const length = children.length;
    
    if (diff > 0) {
      // move left
      return [
        ...children.slice(0, moveIndex),
        children[currentIndex],
        ...children.slice(moveIndex, currentIndex),
        ...children.slice(currentIndex + 1, length),
      ];
    }

    if (diff < 0) {
      // move right
      const index = moveIndex + 1;

      return [
        ...children.slice(0, currentIndex),
        ...children.slice(currentIndex + 1, index),
        children[currentIndex],
        ...children.slice(index, length),
      ];
    }

    return children;
  }

  /**
   * Pass the dragStart id element to drag event dataTransfer
   * @param event 
   */
  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    event.dataTransfer.setData("dragstart", event.currentTarget.id || "");
    
    // calculates the change of mouse position from element being dragged
    const element = document.getElementById(event.currentTarget.id);
    if (element) {
      event.dataTransfer.setData("changeX", (event.nativeEvent.pageX - element.offsetLeft).toString());
      event.dataTransfer.setData("changeY", (event.nativeEvent.pageY - element.offsetTop).toString());
    }
  }

  /**
   * onDrop function for the list modality only
   * @param event 
   * @returns 
   */
  const onDrop = (event: React.DragEvent<HTMLElement>) => {
    if (event.currentTarget.id) {
      const currentId = event.dataTransfer.getData("dragstart");
      const moveId = event.currentTarget.id;

      // Check if the currentId comes from the same selector
      const currentIndex = selectorContext.children?.findIndex(node => node.id === currentId);
      if (currentIndex === -1) {
        alert("Element outside of scope!");
        return;
      }

      // move the element through the list
      const updatedChildren = moveElement(currentId, moveId);

      // set the new updated list to visualize
      selectorContext.setChildren && selectorContext.setChildren(updatedChildren);
    }
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
   * - onDrop activated to the element only for list modality since the list elements is the drop zone
   */
  let itemProps: React.HTMLAttributes<HTMLDivElement> = {};
  if (selectorContext.mode === "list") {
    itemProps.onDrop = onDrop;
  }
  
  return (
    <div
      id={props.id}
      ref={itemRef}
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      style={{
        flex: selectorContext.mode === "list" ? 1 : "unset",
        // position: selectorContext.mode === "canvas" ? "absolute" : "relative",
        // outline: "1px solid blue",
        backgroundColor: props.selected ? "lightblue" : "inherit",
        ...props.style
      }}
      {...itemProps}
    >
      {props.children}
    </div>
  )
}

