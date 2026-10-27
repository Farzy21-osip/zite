"use client";
import { useEffect, useRef, useState } from "react";

import "./OrbitImages.css";

// Images that orbit along an ellipse (or circle), with depth, drag, click-to-front and an intro.
// Written to match the props of the React Bits OrbitImages usage; it is not the original source.
// `easing` only shapes the intro. `alts` (optional) gives each image a caption for screen readers.
const EASE = { linear: (t) => t, easeIn: (t) => t * t, easeOut: (t) => 1 - (1 - t) * (1 - t), easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)) };

export default function OrbitImages({
  images = [], alts = [], dates = [], shape = "ellipse", radiusX = 400, radiusY = 100, radius = 160, rotation = 0, duration = 30,
  itemSize = 100, depth = 0.4, showPath = false, centerContent = null, itemRadius = 12, shadow = 0.3, hoverScale = 1.08,
  hoverSpeed = 1, pathDash = 0, direction = "normal", easing = "linear", fill = true, alignToPath = false,
  draggable = false, clickToFront = false, paused = false, intro = false, className = "",
}) {
  const box = useRef(null);
  const els = useRef([]);
  const st = useRef({ phase: 0, speed: 1, hover: false, drag: null, to: null, intro: intro ? 0 : 1, visible: true, moved: false });
  const [scale, setScale] = useState(1);

  const n = images.length;
  const rx = shape === "circle" ? radius : radiusX;
  const ry = shape === "circle" ? radius : radiusY;
  const th = (rotation * Math.PI) / 180;
  const halfW = Math.hypot(rx * Math.cos(th), ry * Math.sin(th)) + itemSize / 2;
  const halfH = Math.hypot(rx * Math.sin(th), ry * Math.cos(th)) + itemSize / 2;

  const P = useRef({});
  P.current = { n, rx, ry, rotation, duration, depth, paused, direction, alignToPath, hoverSpeed, easing };

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setScale(fill ? Math.min(1, e.contentRect.width / (2 * halfW)) : 1));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [fill, halfW]);

  useEffect(() => {
    const s = st.current;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) s.intro = 1;
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; });
    io.observe(box.current);
    let raf = 0, last = 0, introT = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const p = P.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!s.visible) return;
      if (s.intro < 1) { introT += dt; s.intro = Math.min(1, introT / 1.4); }
      const k = (EASE[p.easing] || EASE.linear)(s.intro);
      const target = p.paused || calm || s.drag ? 0 : s.hover ? p.hoverSpeed : 1;
      s.speed += (target - s.speed) * Math.min(1, dt * 6);
      if (s.to !== null) {
        s.phase += (s.to - s.phase) * Math.min(1, dt * 7);
        if (Math.abs(s.to - s.phase) < 0.0004) { s.phase = s.to; s.to = null; }
      } else if (!s.drag) s.phase += ((p.direction === "reverse" ? -1 : 1) * s.speed * dt) / p.duration;
      for (let i = 0; i < p.n; i++) {
        const el = els.current[i];
        if (!el) continue;
        const a = 2 * Math.PI * (i / p.n + s.phase);
        const sn = Math.sin(a), cs = Math.cos(a);
        const front = (sn + 1) / 2;                       // 1 = nearest to the viewer
        const sc = (1 - p.depth + p.depth * front) * (0.4 + 0.6 * k);
        const tang = p.alignToPath ? (Math.atan2(p.ry * cs, -p.rx * sn) * 180) / Math.PI : 0;
        el.style.transform = `translate(${p.rx * cs * k}px, ${p.ry * sn * k}px) rotate(${-p.rotation + tang}deg) scale(${sc})`;
        el.style.zIndex = Math.round(front * 100);
        el.style.opacity = (0.55 + 0.45 * front) * Math.min(1, k * 1.5);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const down = (e) => {
    if (!draggable) return;
    st.current.drag = { x: e.clientX, ph: st.current.phase };
    st.current.moved = false;
  };
  const move = (e) => {
    const d = st.current.drag;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4 && !st.current.moved) { st.current.moved = true; e.currentTarget.setPointerCapture?.(e.pointerId); }
    if (!st.current.moved) return;
    st.current.to = null;
    st.current.phase = d.ph + (dx / (2 * rx * scale)) * (direction === "reverse" ? -1 : 1);
  };
  const up = () => { st.current.drag = null; };
  const toFront = (i) => {
    if (!clickToFront || st.current.moved) return;
    let d = 0.25 - i / n - st.current.phase;
    d -= Math.round(d);
    st.current.to = st.current.phase + d;
  };

  return (
    <div ref={box} className={`oi${className ? ` ${className}` : ""}`} style={{ height: 2 * halfH * scale + 16, "--oi-hs": hoverScale }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className="oi-plane" style={{ transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)` }}>
        {showPath && (
          <svg className="oi-path" width={2 * rx} height={2 * ry} style={{ left: -rx, top: -ry }} aria-hidden="true">
            <ellipse cx={rx} cy={ry} rx={rx} ry={ry} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray={pathDash ? `${pathDash} ${pathDash * 1.5}` : undefined} />
          </svg>
        )}
        {images.map((src, i) => (
          <button key={src + i} type="button" ref={(el) => { els.current[i] = el; }} className="oi-item"
            style={{ width: itemSize, height: itemSize, marginLeft: -itemSize / 2, marginTop: -itemSize / 2 }}
            onClick={() => toFront(i)} onPointerEnter={() => { st.current.hover = true; }} onPointerLeave={() => { st.current.hover = false; }}
            aria-label={alts[i] || `Image ${i + 1}`}>
            <span className="oi-img" style={{ borderRadius: itemRadius, boxShadow: `0 14px 34px rgba(0,0,0,${shadow})` }}>
              <img src={src} alt="" draggable={false} />
              {dates[i] && <small className="oi-date">{dates[i]}</small>}
            </span>
          </button>
        ))}
        {centerContent && <div className="oi-center" style={{ transform: `translate(-50%, -50%) rotate(${-rotation}deg)` }}>{centerContent}</div>}
      </div>
    </div>
  );
}
