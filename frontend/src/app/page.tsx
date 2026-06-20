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
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    };
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return;
    const vs = `attribute vec2 a_position;varying vec2 v_texCoord;void main(){v_texCoord=a_position*0.5+0.5;gl_Position=vec4(a_position,0.0,1.0);}`;
    const fs = `precision highp float;uniform float u_time;uniform vec2 u_resolution;uniform vec2 u_mouse;varying vec2 v_texCoord;float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}void main(){vec2 uv=v_texCoord;vec2 mouse=u_mouse/u_resolution;vec2 g_uv=uv*15.0;vec2 id=floor(g_uv);vec2 f_uv=fract(g_uv)-0.5;float minDist=1.0;for(float y=-1.0;y<=1.0;y++){for(float x=-1.0;x<=1.0;x++){vec2 neighbor=vec2(x,y);float h=hash(id+neighbor);vec2 point=neighbor+vec2(sin(u_time*h),cos(u_time*h))*0.4;float d_mouse=distance(uv,mouse);point+=(uv-mouse)*exp(-d_mouse*5.0)*0.2;float dist=length(f_uv-point);minDist=min(minDist,dist);}}vec3 bgColor=vec3(0.0588,0.0902,0.1647);float glow=0.02/(minDist+0.01);vec3 pointColor=vec3(0.4,0.5,1.0)*glow;float grid=(step(0.98,fract(uv.x*20.0))+step(0.98,fract(uv.y*20.0)))*0.05;vec3 finalColor=bgColor+pointColor+grid;finalColor*=1.0-length(uv-0.5)*0.5;gl_FragColor=vec4(finalColor,1.0);}`;
    const createShader = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
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
      if (rect.width && rect.height) { mouse.x = ((e.clientX - rect.left) / rect.width) * canvas.width; mouse.y = (1 - (e.clientY - rect.top) / rect.height) * canvas.height; }
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
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); window.removeEventListener("mousemove", onMouseMove); };
  }, []);

  const FEATURES = [
    { icon: "◎", title: "Human-in-the-Loop", desc: "The system augments, never automates. Every node and conclusion requires your explicit validation." },
    { icon: "⬡", title: "Structural Thinking", desc: "Map sprawling thoughts into logical, interactive graphs that reveal underlying assumptions and dependencies." },
    { icon: "⚖", title: "Tradeoff Analysis", desc: "Quantify the invisible costs of every path. Visualize what you are sacrificing for what you are gaining." },
    { icon: "◈", title: "Responsible AI", desc: "Radical transparency. No black-box recommendations. Full traceability for every logical leap." },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 sm:px-10 h-16 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-4 sm:gap-8">
          <span className="font-bold text-xl sm:text-[22px] tracking-tight text-zinc-900">REVERIE</span>
        </div>
        <button onClick={() => router.push("/app")} className="px-4 sm:px-5 py-2 bg-zinc-900 text-white rounded text-sm font-semibold cursor-pointer hover:bg-zinc-800 transition-colors">
          Open Chat
        </button>
      </nav>

      <section className="relative flex flex-col items-center justify-center min-h-100 sm:min-h-175 mt-16 overflow-hidden rounded-none sm:rounded-2xl mx-0 sm:mx-10 border-0 sm:border sm:border-zinc-200">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
        <div className="absolute inset-0 bg-black/18 z-1" />
        <div className="relative z-2 flex flex-col items-center text-center gap-5 sm:gap-7 max-w-190 px-4 sm:px-6 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-md px-3 sm:px-4.5 py-1.5 sm:py-2 rounded-full border border-white/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-white tracking-widest uppercase">Human-in-the-loop Status: Active</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight text-white m-0">
            Don&apos;t ask AI what to do.<br />
            <span className="text-cyan-400">Ask AI to help you think.</span>
          </h1>
          <p className="font-mono text-sm sm:text-base text-white/85 leading-relaxed max-w-145 m-0">
            A Second Brain for Real Life. Navigate high-stakes career decisions with clarity, structural thinking, and evidence — not opaque recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
            <button onClick={() => router.push("/app")} className="px-6 sm:px-9 py-3 sm:py-4 bg-white text-zinc-900 rounded text-sm font-bold cursor-pointer shadow-lg hover:opacity-90 transition-opacity">
              Start Your Reasoning Journey
            </button>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 sm:px-9 py-3 sm:py-4 bg-black/30 backdrop-blur-md text-white border border-white/30 rounded text-sm font-semibold cursor-pointer hover:bg-black/50 transition-colors">
              How it Works
            </button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-10 border-t border-zinc-200 mt-8 sm:mt-12">
        <div className="text-center mb-10 sm:mb-14 max-w-175 mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4 leading-tight">
            You are the decision maker.<br />
            We are the architects of your reasoning.
          </h2>
          <p className="font-mono text-sm text-zinc-600 leading-relaxed">
            REVERIE is designed to eradicate cognitive bias and structural blind spots. We provide the scaffolding; you provide the intent.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-300 mx-auto">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white p-5 sm:p-6 border border-zinc-200 rounded hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-[28px] mb-4 text-indigo-500">{f.icon}</div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 mb-2">{f.title}</h3>
              <p className="font-mono text-xs text-zinc-500 leading-relaxed m-0">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-10 pb-16 sm:pb-24 max-w-300 mx-auto">
        <div className="bg-zinc-900 rounded-lg p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <div className="font-mono text-[11px] font-semibold text-indigo-400 tracking-widest uppercase mb-4">9-Layer Reasoning System</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight mb-5">From uncertainty to clarity in 9 structured steps</h2>
            <p className="font-mono text-sm text-white/60 leading-relaxed mb-8">
              Each layer builds on the last — extraction leads to belief mapping, which reveals assumptions, which stress-tests your scenarios.
            </p>
            <button onClick={() => router.push("/app")}
              className="px-7 py-3.5 bg-indigo-500 text-white rounded text-sm font-bold cursor-pointer hover:bg-indigo-600 transition-colors w-full sm:w-auto">
              Begin Analysis →
            </button>
          </div>
          <div className="flex flex-col gap-3">
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
              <div key={layer.n} className="flex gap-4 items-start">
                <span className="font-mono text-[11px] font-bold text-indigo-400 min-w-6 mt-0.5">{layer.n}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{layer.label}</div>
                  <div className="font-mono text-[11px] text-white/40 mt-0.5">{layer.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bottom-0 left-0 w-full z-50 flex flex-col sm:flex-row justify-between items-center px-4 sm:px-10 py-2 sm:h-11 bg-zinc-200 border-t border-zinc-300 font-mono text-[10px] sm:text-[11px] text-zinc-600">
        <span className="font-bold text-zinc-900">REVERIE</span>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 items-center">
          <span>Reverie is a reasoning tool, not a decision maker. You are in control.</span>
          <span className="font-bold text-zinc-900">Human-in-the-loop Status: Active</span>
        </div>
      </footer>
    </div>
  );
}
