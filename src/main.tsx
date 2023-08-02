import React from "react";
import { useState } from "react";
import { ReactNode } from "react";
import { useEffect } from "react";
import { FC, useRef } from "react";
import { Root, createRoot } from "react-dom/client";

const ListElement: FC<{ index: number, children: ReactNode }> = ({ index, children }) => {
  return (
    <li>
      <div>
        <div>
          index {index} {(index % 2) == 0 ? children : ""}
        </div>
      </div>
    </li>
  )
};

const ListsElement: FC<{ loop: number }> = ({ loop }) => {
  const refSlotTemplate = useRef<HTMLSlotElement>(null)
  const result = useSlot(refSlotTemplate);
  if (result) {
    const [inner] = result;
    return (
      <div>
        <slot name="isEven" ref={refSlotTemplate} />
        <ul>
          {[...Array(loop)].map((_, i) => (
            <ListElement key={i} index={i}>
              <Template child={ inner } />
            </ListElement>
          ))}
        </ul>
      </div>
    );
  }
  
  return (
    <div>
      <slot name="isEven" ref={refSlotTemplate} />
     
      <ul>
        {[...Array(loop)].map((_, i) => (
          <ListElement key={i} index={i} children={undefined} />
        ))}
      </ul>
    </div>
  );
};

const Template: FC<{ child: ChildNode }> = ({ child }) => {
  return <span ref={ ref => ref?.appendChild(child.cloneNode(true)) }></span>
}

export function useSlot(ref: React.RefObject<HTMLSlotElement>) {
  const [childNodes, setChildNodes] = useState<ChildNode[]>();
  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    const handler = () => setChildNodes(
      current
        .assignedNodes() as ChildNode[]
    );
    handler();
  }, []);
  return childNodes;
}

class MyElement extends HTMLElement {
  root: Root;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.root = createRoot(this.shadowRoot!);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.root.render(
      <ListsElement loop={5} />
    );
  }
}

customElements.define('my-element', MyElement)