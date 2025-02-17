import { memo, useEffect } from 'react';
import shallow from 'zustand/shallow';

import { ReactFlowState, OnSelectionChangeFunc, Node, Edge } from '../../types';
import { useStore, useStoreApi } from '../../hooks/useStore';

interface SelectionListenerProps {
  onSelectionChange: OnSelectionChangeFunc;
}

const selector = (s: ReactFlowState) => ({
  selectedNodes: Array.from(s.nodeInternals.values()).filter((n) => n.selected),
  selectedEdges: s.edges.filter((e) => e.selected),
});

type SelectorSlice = ReturnType<typeof selector>;

function areEqual(objA: SelectorSlice, objB: SelectorSlice) {
  const selectedNodeIdsA = objA.selectedNodes.map((n: Node) => n.id);
  const selectedNodeIdsB = objB.selectedNodes.map((n: Node) => n.id);

  const selectedEdgeIdsA = objA.selectedEdges.map((e: Edge) => e.id);
  const selectedEdgeIdsB = objB.selectedEdges.map((e: Edge) => e.id);

  return shallow(selectedNodeIdsA, selectedNodeIdsB) && shallow(selectedEdgeIdsA, selectedEdgeIdsB);
}

// This is just a helper component for calling the onSelectionChange listener.
// @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?
function SelectionListener({ onSelectionChange }: SelectionListenerProps) {
  const store = useStoreApi();
  const { selectedNodes, selectedEdges } = useStore(selector, areEqual);

  useEffect(() => {
    const params = { nodes: selectedNodes, edges: selectedEdges };

    onSelectionChange(params);
    store.getState().onSelectionChange?.(params);
  }, [selectedNodes, selectedEdges]);

  return null;
}

export default memo(SelectionListener);
