import { useEffect, useState } from "react";

export const useSlot = (ref: React.RefObject<HTMLSlotElement>) => {
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