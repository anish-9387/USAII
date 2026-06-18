"use client";

import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import type { BeliefGraph as BeliefGraphType } from "@/lib/types";

const TYPE_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  goal: { bg: "#EEF2FF", border: "#6366F1", text: "#3730A3", label: "GOAL" },
  constraint: { bg: "#FFFBEB", border: "#F59E0B", text: "#92400E", label: "CONSTRAINT" },
  priority: { bg: "#ECFDF5", border: "#10B981", text: "#065F46", label: "PRIORITY" },
  fear: { bg: "#FEF2F2", border: "#EF4444", text: "#991B1B", label: "FEAR" },
  action: { bg: "#F0FDF4", border: "#06B6D4", text: "#0E7490", label: "ACTION" },
};

function layoutNodes(nodes: Node[]): Node[] {
  const typeOrder = ["goal", "priority", "constraint", "fear", "action"];
  const cols: Record<string, Node[]> = {};
  typeOrder.forEach((t) => (cols[t] = []));
  nodes.forEach((n) => {
    const t = (n.data as { nodeType?: string }).nodeType ?? "goal";
    (cols[t] = cols[t] || []).push(n);
  });
  const positioned: Node[] = [];
  let colX = 0;
  typeOrder.forEach((type) => {
    const group = cols[type] || [];
    group.forEach((n, i) => {
      positioned.push({ ...n, position: { x: colX * 220, y: i * 90 } });
    });
    if (group.length) colX++;
  });
  return positioned;
}

export function BeliefGraph({ graph }: { graph: BeliefGraphType }) {
  const rawNodes: Node[] = graph.nodes.map((n) => {
    const style = TYPE_STYLES[n.type] || TYPE_STYLES.goal;
    return {
      id: n.id,
      position: { x: 0, y: 0 },
      data: {
        nodeType: n.type,
        label: (
          <div className="text-center">
            <div className="font-mono text-[9px] font-semibold tracking-wider uppercase mb-0.5" style={{ color: style.text }}>
              {style.label}
            </div>
            <div className="font-sans text-xs font-semibold text-zinc-900 leading-tight">{n.label}</div>
          </div>
        ),
      },
      style: {
        background: style.bg,
        border: `1.5px solid ${style.border}`,
        borderRadius: 4,
        padding: "10px 14px",
        minWidth: 130,
      },
    };
  });

  const initialNodes = layoutNodes(rawNodes);

  const initialEdges: Edge[] = graph.edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    label: e.label,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94A3B8" },
    style: { stroke: "#CBD5E1", strokeWidth: 1.5 },
    labelStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: 10, fill: "#94A3B8" },
    labelBgStyle: { fill: "#F8FAFC", fillOpacity: 0.9 },
  }));

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const legend = Object.entries(TYPE_STYLES);

  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 2 // Belief Graph
      </div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[28px] font-bold tracking-tight mt-1 mb-2">Layer 2: Belief Mapping</h2>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
            <span className="font-mono text-xs">
              {graph.nodes.length} nodes · {graph.edges.length} edges · interactive
            </span>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap max-w-[320px] justify-end">
          {legend.map(([type, s]) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded font-mono"
              style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded" style={{ height: 500 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          style={{ background: "#F8FAFC", borderRadius: 4 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#CBD5E1" />
          <Controls style={{ boxShadow: "none", border: "1px solid #E2E8F0" }} />
        </ReactFlow>
      </div>
      <p className="mt-2.5 text-[11px] text-zinc-400 font-mono">
        Drag nodes to rearrange · Scroll to zoom · Every node requires your explicit validation.
      </p>
    </div>
  );
}
