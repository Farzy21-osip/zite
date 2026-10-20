"use client";
import { usePathname } from "next/navigation";
import SpecularButton from "./SpecularButton";
import { site } from "../lib/data";

export default function Footer() {
  const home = usePathname() === "/";
  const mail = () => { window.location.href = `mailto:${site.email}`; };
  const cta = (
    <div className="cta">
      <SpecularButton size={home ? "lg" : "md"} radius={999} lineColor="#F5B84B" baseColor="#3A4560" textColor="#E8ECF4" onClick={mail}>
        Contact me
      </SpecularButton>
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
