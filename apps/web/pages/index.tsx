import { SelectorItem, SelectorProvider } from "selector";

export default function Web() {
  return (
    <div>
      <h1>Move element inside a vertical list</h1>
      <SelectorProvider mode="list">
        <SelectorItem>
          <div>
            Item A
          </div>
        </SelectorItem>

        <SelectorItem>
          <p>
            Item B
          </p>
        </SelectorItem>
        
        <SelectorItem>
          <span>
            Item C
          </span>
        </SelectorItem>
        
        <SelectorItem>
          <label>
            Item D
          </label>
        </SelectorItem>
        
        <SelectorItem>
          Item E
        </SelectorItem>
        
        <SelectorItem>
          Item F
        </SelectorItem>
      </SelectorProvider>

      <h1>Move element inside a horizontal list</h1>
      <SelectorProvider mode="list" direction="row">
        <SelectorItem>
          <div style={{ width: "200px", height: "200px", border: "solid 1px blue" }}>
            Item A 
          </div>
        </SelectorItem>

        <SelectorItem>
          <div style={{ border: "solid 1px red" }}>
            Item B
          </div>
        </SelectorItem>
        
        <SelectorItem>
          <div>
            Item C
          </div>
        </SelectorItem>
        
        <SelectorItem>
          <p>
            Item D
          </p>
        </SelectorItem>
        
        <SelectorItem>
          Item E
        </SelectorItem>
        
        <SelectorItem>
          <ul>
            <li>Item F</li>
            <li>Item G</li>
            <li>Item H</li>
          </ul>
        </SelectorItem>
      </SelectorProvider>

      <h1>Move element inside a canvas</h1>
      <p style={{ color: "orangered" }}>*For the canvas usage, width and height must be defined</p>
      <SelectorProvider mode="canvas" width="100%" height="500px">
        <SelectorItem>
          <div style={{ width: "100px", height: "100px", border: "solid 1px red" }}>
            Item A
          </div>
        </SelectorItem>

        <SelectorItem>
          <div style={{ width: "100px", height: "100px", border: "solid 1px blue" }}>
            Item B
          </div>
        </SelectorItem>
        
        <SelectorItem>
          <div style={{ width: "100px", height: "100px", border: "solid 1px green" }}>
            Item C
          </div>
        </SelectorItem>
        
        <SelectorItem>
          <div style={{ width: "100px", height: "100px", border: "solid 1px yellow" }}>
            Item D
          </div>
        </SelectorItem>
        
        <SelectorItem>
          <div style={{ width: "100px", height: "100px", border: "solid 1px purple" }}>
            Item E
          </div>
        </SelectorItem>
        
        <SelectorItem>
          <div style={{ width: "100px", height: "100px", border: "solid 1px grey" }}>
            Item F
          </div>
        </SelectorItem>
      </SelectorProvider>
    </div>
  );
}
