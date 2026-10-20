import "./globals.css";
import { Bricolage_Grotesque, IBM_Plex_Sans, Caveat } from "next/font/google";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Highlight from "../components/Highlight";
import PopLayer from "../components/PopLayer";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-body" });
const hand = Caveat({ subsets: ["latin"], variable: "--f-hand" });

export const metadata = {
  title: "Rizky Zilant: projects, competitions and notes",
  description: "Electronics, code and physics: projects, competitions and the notes behind them.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body>
        <Nav />
        <Highlight />
        <PopLayer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
