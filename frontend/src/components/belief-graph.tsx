"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import type { BeliefGraph as BeliefGraphType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const typeColors: Record<string, string> = {
  goal: "#10b981",
  constraint: "#f59e0b",
  priority: "#3b82f6",
  fear: "#f43f5e",
  action: "#8b5cf6",
};

export function BeliefGraph({ graph }: { graph: BeliefGraphType }) {
  const initialNodes: Node[] = graph.nodes.map((n, i) => ({
    id: n.id,
    position: { x: 200 * (i % 3), y: 120 * Math.floor(i / 3) },
    data: { label: n.label },
    style: {
      background: typeColors[n.type] || "#6b7280",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 16px",
      fontSize: "13px",
      fontWeight: 500,
    },
  }));

  const initialEdges: Edge[] = graph.edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    label: e.label,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#a1a1aa", strokeWidth: 2 },
    labelStyle: { fontSize: 11, fill: "#71717a" },
  }));

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Belief Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full rounded-lg border border-zinc-200 dark:border-zinc-800">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
