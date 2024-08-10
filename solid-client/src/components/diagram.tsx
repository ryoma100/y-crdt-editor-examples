import { For, JSXElement, Show } from "solid-js";

import { useGraphContext } from "../context";
import { Edge } from "./edge";
import { Node } from "./node";

import "./diagram.css";

export function Diagram(): JSXElement {
  const { dataModel } = useGraphContext();

  function handleMouseDown(e: MouseEvent) {
    dataModel.clearSelect();
    if (dataModel.toolbarMode() === "addNode") {
      dataModel.addNode(e.clientX, e.clientY);
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (dataModel.dragMode() !== "none") {
      dataModel.dragMove(e.movementX, e.movementY);
    }
    if (dataModel.addingEdgeLine() != null) {
      dataModel.addEdgeMove(e.clientX, e.clientY);
    }
  }

  function handleMouseUp() {
    switch (dataModel.toolbarMode()) {
      case "pointer":
      case "addNode":
        dataModel.dragEnd();
        break;
      case "addEdge":
        dataModel.addEdgeEnd();
        break;
    }
  }

  return (
    <svg
      class="diagram"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <g data-id="edges">
        <For each={dataModel.graphStore.edgeList}>
          {(edge) => Edge({ edge })}
        </For>
      </g>
      <g data-id="nodes">
        <For each={dataModel.graphStore.nodeList}>
          {(node) => Node({ node })}
        </For>
      </g>
      <g data-id="addingLine">
        <Show when={dataModel.addingEdgeLine() != null}>
          <line
            class="adding-line"
            x1={dataModel.addingEdgeLine()?.startPoint.x}
            y1={dataModel.addingEdgeLine()?.startPoint.y}
            x2={dataModel.addingEdgeLine()?.endPoint.x}
            y2={dataModel.addingEdgeLine()?.endPoint.y}
          />
        </Show>
      </g>
    </svg>
  );
}
