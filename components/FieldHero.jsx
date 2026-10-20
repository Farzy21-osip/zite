"use client";
import { useEffect, useRef } from "react";

// A grid of small compass needles that turn toward the cursor (or a slowly drifting point).
export default function FieldHero() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d"), host = c.parentElement;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = 46;
    let w, h, raf, mx = 0, my = 0, hover = false;

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) draw(0);
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const ax = hover ? mx : w * (0.68 + 0.18 * Math.sin(t / 4000));
      const ay = hover ? my : h * (0.5 + 0.25 * Math.sin(t / 5300));
      ctx.lineWidth = 1.4; ctx.lineCap = "round";
      for (let y = step / 2; y < h; y += step)
        for (let x = step / 2; x < w; x += step) {
          const dx = ax - x, dy = ay - y;
          const a = Math.atan2(dy, dx), k = Math.max(0, 1 - Math.hypot(dx, dy) / 380);
          const L = (8 + 10 * k) / 2, cx = Math.cos(a) * L, cy = Math.sin(a) * L;
          ctx.strokeStyle = `rgba(${70 + 175 * k | 0},${185 - 1 * k | 0},${200 - 125 * k | 0},${0.2 + 0.7 * k})`;
          ctx.beginPath(); ctx.moveTo(x - cx, y - cy); ctx.lineTo(x + cx, y + cy); ctx.stroke();
        }
      if (!still) raf = requestAnimationFrame(draw);
    };
    const move = (e) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; hover = true; };
    const leave = () => { hover = false; };

    size();
    if (!still) raf = requestAnimationFrame(draw);
    addEventListener("resize", size);
    host.addEventListener("mousemove", move);
    host.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      host.removeEventListener("mousemove", move);
      host.removeEventListener("mouseleave", leave);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" />;
}
