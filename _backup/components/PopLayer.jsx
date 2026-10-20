"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One listener for the whole site. It finds the [data-pop] item under the cursor, tilts that item's
// pop-up icon toward the cursor, and fades in the matching full-screen design layer (menu pages only).
export default function PopLayer() {
  const path = usePathname();
  useEffect(() => {
    let cur = null;
    const set = (el) => {
      if (el === cur) return;
      cur?.removeAttribute("data-popping");
      document.querySelectorAll(".layer[data-on]").forEach((l) => l.removeAttribute("data-on"));
      cur = el;
      if (!el) return;
      el.setAttribute("data-popping", "");
      document.querySelector(`.layer[data-for="${el.dataset.pop}"]`)?.setAttribute("data-on", "");
    };
    const find = (t) => (t && t.closest ? t.closest("[data-pop]") : null);
    const move = (e) => {
      if (e.pointerType === "touch") return;
      const el = find(e.target);
      set(el);
      if (!el) return;
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");
      el.style.setProperty("--tx", x > r.width * 0.62 ? "calc(-100% - 24px)" : "24px");
      el.style.setProperty("--ry", (x / r.width - 0.5) * 36 + "deg");
      el.style.setProperty("--rx", (0.5 - y / r.height) * 36 + "deg");
    };
    const focus = (e) => set(find(e.target));
    const off = () => set(null);
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("focusin", focus);
    document.addEventListener("pointerleave", off);
    addEventListener("blur", off);
    return () => {
      set(null);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("pointerleave", off);
      removeEventListener("blur", off);
    };
  }, [path]);
  return null;
}
