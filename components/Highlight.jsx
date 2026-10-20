"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// When a page opens with #something in the URL, find that element, highlight it and scroll to it.
export default function Highlight() {
  const path = usePathname();
  useEffect(() => {
    const run = () => {
      document.querySelectorAll("[data-hl]").forEach((e) => e.removeAttribute("data-hl"));
      const id = decodeURIComponent(location.hash.slice(1));
      if (id === "contact") return;
      const el = id && document.getElementById(id);
      if (!el) return;
      el.setAttribute("data-hl", "");
      el.querySelector("details")?.setAttribute("open", "");
      const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
    };
    const t = setTimeout(run, 80);
    addEventListener("hashchange", run);
    return () => { clearTimeout(t); removeEventListener("hashchange", run); };
  }, [path]);
  return null;
}
