"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 700;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}
void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    vec2 g_uv = uv * 15.0;
    vec2 id = floor(g_uv);
    vec2 f_uv = fract(g_uv) - 0.5;
    float minDist = 1.0;
    for(float y = -1.0; y <= 1.0; y++) {
        for(float x = -1.0; x <= 1.0; x++) {
            vec2 neighbor = vec2(x, y);
            float h = hash(id + neighbor);
            vec2 point = neighbor + vec2(sin(u_time * h), cos(u_time * h)) * 0.4;
            float d_mouse = distance(uv, mouse);
            point += (uv - mouse) * exp(-d_mouse * 5.0) * 0.2;
            float dist = length(f_uv - point);
            minDist = min(minDist, dist);
        }
    }
    vec3 bgColor = vec3(0.0588, 0.0902, 0.1647);
    float glow = 0.02 / (minDist + 0.01);
    vec3 pointColor = vec3(0.4, 0.5, 1.0) * glow;
    float grid = (step(0.98, fract(uv.x * 20.0)) + step(0.98, fract(uv.y * 20.0))) * 0.05;
    vec3 finalColor = bgColor + pointColor + grid;
    finalColor *= 1.0 - length(uv - 0.5) * 0.5;
    gl_FragColor = vec4(finalColor, 1.0);
}`;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouse.x = ((e.clientX - rect.left) / rect.width) * canvas.width;
        mouse.y = (1 - (e.clientY - rect.top) / rect.height) * canvas.height;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    const render = (t: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const FEATURES = [
    {
      icon: "◎",
      title: "Human-in-the-Loop",
      desc: "The system augments, never automates. Every node and conclusion requires your explicit validation.",
    },
    {
      icon: "⬡",
      title: "Structural Thinking",
      desc: "Map sprawling thoughts into logical, interactive graphs that reveal underlying assumptions and dependencies.",
    },
    {
      icon: "⚖",
      title: "Tradeoff Analysis",
      desc: "Quantify the invisible costs of every path. Visualize what you are sacrificing for what you are gaining.",
    },
    {
      icon: "◈",
      title: "Responsible AI",
      desc: "Radical transparency. No black-box recommendations. Full traceability for every logical leap.",
    },
  ];

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#F7F9FB", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 40px", height: 64,
        background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", color: "#0F172A" }}>PARALLAX</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Extraction", "Stress Test", "Scenarios"].map((item) => (
              <a key={item} href="/app" style={{ color: "#475569", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.color = "#6366F1")}
                onMouseOut={e => (e.currentTarget.style.color = "#475569")}>
                {item}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => router.push("/app")}
            style={{ padding: "8px 20px", background: "#0F172A", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Open App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: "relative", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: 700, marginTop: 64, overflow: "hidden",
        borderRadius: 24, margin: "80px 40px 0",
        border: "1px solid #E2E8F0",
      }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 28, maxWidth: 760, padding: "60px 24px" }}>
          {/* Status badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)",
            padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CD7F6", display: "inline-block" }} />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Human-in-the-loop Status: Active
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
            Don&apos;t ask AI what to do.<br />
            <span style={{ color: "#4CD7F6" }}>Ask AI to help you think.</span>
          </h1>

          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, maxWidth: 580, margin: 0 }}>
            A Second Brain for Real Life. Navigate high-stakes career decisions with clarity, structural thinking, and evidence — not opaque recommendations.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => router.push("/app")}
              style={{ padding: "16px 36px", background: "#fff", color: "#0F172A", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", transition: "opacity 0.15s" }}
              onMouseOver={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}>
              Start Your Reasoning Journey
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "16px 36px", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
              onMouseOut={e => (e.currentTarget.style.background = "rgba(0,0,0,0.3)")}>
              How it Works
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Philosophy */}
      <section id="how-it-works" style={{ padding: "96px 40px", borderTop: "1px solid #E2E8F0", marginTop: 48 }}>
        <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 700, margin: "0 auto 56px" }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.01em", color: "#0F172A", marginBottom: 16, lineHeight: 1.2 }}>
            You are the decision maker.<br />
            We are the architects of your reasoning.
          </h2>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, color: "#475569", lineHeight: 1.8 }}>
            PARALLAX is designed to eradicate cognitive bias and structural blind spots. We provide the scaffolding; you provide the intent.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              background: "#fff", padding: 24, border: "1px solid #E2E8F0", borderRadius: 4,
              transition: "box-shadow 0.15s", cursor: "default",
            }}
              onMouseOver={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)")}
              onMouseOut={e => (e.currentTarget.style.boxShadow = "none")}>
              <div style={{ fontSize: 28, marginBottom: 16, color: "#6366F1" }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#64748B", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How the layers work */}
      <section style={{ padding: "0 40px 96px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "#0F172A", borderRadius: 8, padding: "56px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600, color: "#6366F1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              9-Layer Reasoning System
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 20 }}>
              From uncertainty to clarity in 9 structured steps
            </h2>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 32 }}>
              Each layer builds on the last — extraction leads to belief mapping, which reveals assumptions, which stress-tests your scenarios.
            </p>
            <button
              onClick={() => router.push("/app")}
              style={{ padding: "14px 28px", background: "#6366F1", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Begin Analysis →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { n: "01", label: "Semantic Extraction", desc: "Goals · Constraints · Priorities · Fears" },
              { n: "02", label: "Belief Graph", desc: "Map causal relationships visually" },
              { n: "03", label: "Assumption Stress Test", desc: "Challenge what you take for granted" },
              { n: "04", label: "Contradiction Detection", desc: "Surface internal logical conflicts" },
              { n: "05", label: "Counterfactual Scenarios", desc: "Explore 3 possible futures" },
              { n: "06", label: "Tradeoff Analysis", desc: "Multi-dimensional comparison radar" },
              { n: "07", label: "Reflection", desc: "Adaptive questions to clarify thinking" },
              { n: "08", label: "Decision Contract", desc: "Lock in your reasoning on paper" },
              { n: "09", label: "90-Day Action Plan", desc: "Concrete next steps with risk mitigation" },
            ].map((layer) => (
              <div key={layer.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, color: "#6366F1", minWidth: 24, marginTop: 2 }}>
                  {layer.n}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{layer.label}</div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{layer.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 40px", height: 44,
        background: "#E0E3E5", borderTop: "1px solid #C6C6CD",
        fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#45464D",
      }}>
        <span style={{ fontWeight: 700, color: "#0F172A" }}>PARALLAX</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span>Parallax is a reasoning tool, not a decision maker. You are in control.</span>
          <a href="#" style={{ color: "#45464D", textDecoration: "none" }}>Ethics Policy</a>
          <a href="#" style={{ color: "#45464D", textDecoration: "none" }}>Methodology</a>
          <span style={{ fontWeight: 700, color: "#0F172A" }}>Human-in-the-loop Status: Active</span>
        </div>
      </footer>
    </div>
  );
}
