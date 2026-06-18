"use client";

import { useCallback, useEffect, useState } from "react";
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
  goal:       { bg: "#EEF2FF", border: "#6366F1", text: "#3730A3", label: "GOAL" },
  constraint: { bg: "#FFFBEB", border: "#F59E0B", text: "#92400E", label: "CONSTRAINT" },
  priority:   { bg: "#ECFDF5", border: "#10B981", text: "#065F46", label: "PRIORITY" },
  fear:       { bg: "#FEF2F2", border: "#EF4444", text: "#991B1B", label: "FEAR" },
  action:     { bg: "#F0FDF4", border: "#06B6D4", text: "#0E7490", label: "ACTION" },
};

// Simple dagre-like layout: bucket by type then position
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
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", color: style.text, marginBottom: 2, textTransform: "uppercase" }}>
              {style.label}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#0F172A", lineHeight: 1.3 }}>
              {n.label}
            </div>
          </div>
        ),
      },
      style: {
        background: style.bg,
        border: `1.5px solid ${style.border}`,
        borderRadius: 4,
        padding: "10px 14px",
        minWidth: 130,
        boxShadow: "none",
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
      <div className="section-label" style={{ marginBottom: 8 }}>Layer 2 // Belief Graph</div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
            Layer 2: Belief Mapping
          </h2>
          <div className="status-line">
            <span className="status-dot" />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
              {graph.nodes.length} nodes · {graph.edges.length} edges · interactive
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 320, justifyContent: "flex-end" }}>
          {legend.map(([type, s]) => (
            <span key={type} className="chip" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card" style={{ height: 500 }}>
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
      <p style={{ marginTop: 10, fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
        Drag nodes to rearrange · Scroll to zoom · Every node requires your explicit validation.
      </p>
    </div>
  );
}
