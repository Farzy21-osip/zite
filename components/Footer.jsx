"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SpecularButton from "./SpecularButton";
import { site } from "../lib/data";

export default function Footer() {
  const home = usePathname() === "/";
  const [note, setNote] = useState("");

  // Copies the address instead of forcing the browser to open a mail app, which fails on machines without one.
  const copy = async () => {
    let ok = true;
    try { await navigator.clipboard.writeText(site.email); } catch { ok = false; }
    setNote(ok ? "Email copied:" : "My email:");
    setTimeout(() => setNote(""), 4000);
  };
  const cta = (
    <div className="cta">
      <SpecularButton size={home ? "lg" : "md"} radius={999} lineColor="#F5B84B" baseColor="#3A4560" textColor="#E8ECF4" onClick={copy}>
        Contact me
      </SpecularButton>
      {note && <p className="copied" role="status">{note} {site.email}. <a className="more" href={`mailto:${site.email}`}>Open my mail app</a></p>}
    </div>
  );
  const info = (
    <div>
      {home && <h2>Contact</h2>}
      <a className="mail" href={`mailto:${site.email}`}>{site.email}</a>
      <p className="lede">A link to download my CV (PDF) will go here.</p>
    </div>
  );
  return home ? (
    <footer id="contact"><div className="wrap contact-home">{info}{cta}</div></footer>
  ) : (
    <footer id="contact" className="small"><div className="wrap">{info}{cta}</div></footer>
  );
}
